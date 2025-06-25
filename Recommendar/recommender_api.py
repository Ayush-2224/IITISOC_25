from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import pandas as pd
import joblib
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
from concurrent.futures import ThreadPoolExecutor, as_completed

app = Flask(__name__)
CORS(app)

# Load data and models
df = pd.read_csv("processed_movies.csv")
tfidf = joblib.load("tfidf_vectorizer.pkl")
tfidf_matrix = joblib.load("tfidf_matrix.pkl")

# 🔑 Your TMDB API key
TMDB_API_KEY = "cf79ad9b3dc6fe6f2cd294b1ea756d62"

@lru_cache(maxsize=10000)
def fetch_movie_features_cached(movie_id):
    return fetch_movie_features(movie_id)

@lru_cache(maxsize=10000)
def fetch_poster_url_cached(movie_id):
    return fetch_poster_url(movie_id)

def fetch_movie_features(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&language=en-US"
    res = requests.get(url)
    if res.status_code != 200:
        return ""
    data = res.json()
    genres = " ".join([g['name'].replace(" ", "") for g in data.get('genres', [])])
    tagline = data.get('tagline', '').replace(" ", "")
    keywords = fetch_keywords(movie_id)
    return f"{genres} {keywords} {tagline}".strip()

def fetch_keywords(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/keywords?api_key={TMDB_API_KEY}"
    res = requests.get(url)
    if res.status_code != 200:
        return ""
    data = res.json()
    return " ".join([k['name'].replace(" ", "") for k in data.get('keywords', [])])

def fetch_poster_url(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&language=en-US"
    res = requests.get(url)
    if res.status_code != 200:
        return ""
    data = res.json()
    poster_path = data.get('poster_path', '')
    return f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else ""

@app.route('/recommend', methods=['POST'])
def recommend_history():
    data = request.get_json()
    ids = data.get("watchedIds", [])
    if not ids:
        return jsonify({"error": "No movie IDs provided"}), 400

    # Parallel fetch features for watched movies
    combined_text = ""
    with ThreadPoolExecutor(max_workers=8) as executor:
        future_to_id = {executor.submit(fetch_movie_features_cached, movie_id): movie_id for movie_id in ids}
        for future in as_completed(future_to_id):
            combined_text += " " + future.result()

    if not combined_text.strip():
        return jsonify({"error": "Failed to fetch data for given IDs"}), 500

    input_vec = tfidf.transform([combined_text])
    similarity_scores = cosine_similarity(input_vec, tfidf_matrix).flatten()
    top_indices = similarity_scores.argsort()[::-1]

    watched_set = set(ids)
    recommendations = []
    poster_futures = []
    poster_results = {}

    # Prepare top movie IDs to fetch posters for (in parallel)
    top_movie_ids = []
    for i in top_indices:
        movie = df.iloc[i]
        movie_id = int(movie['id'])
        if movie_id in watched_set:
            continue
        top_movie_ids.append(movie_id)
        if len(top_movie_ids) == 20:
            break

    # Parallel fetch posters
    with ThreadPoolExecutor(max_workers=8) as executor:
        future_to_id = {executor.submit(fetch_poster_url_cached, movie_id): movie_id for movie_id in top_movie_ids}
        for future in as_completed(future_to_id):
            poster_results[future_to_id[future]] = future.result()

    # Build recommendations (up to 12)
    for i in top_indices:
        movie = df.iloc[i]
        movie_id = int(movie['id'])
        if movie_id in watched_set:
            continue
        poster_url = poster_results.get(movie_id, "")
        recommendations.append({
            "id": movie_id,
            "title": movie['original_title'],
            "poster": poster_url
        })
        if len(recommendations) == 12:
            break
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)
