from flask import Flask, request, jsonify
import numpy as np
import joblib
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from bson import ObjectId
from sentence_transformers import SentenceTransformer
import os
import requests
from collections import Counter
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
MODEL_DIR = "models"
fallback_path = os.path.join(MODEL_DIR, "cached_fallback.pkl")
embeddings = joblib.load(os.path.join(MODEL_DIR, "embeddings.pkl"))
movie_ids = joblib.load(os.path.join(MODEL_DIR, "movie_ids.pkl"))
metadata = joblib.load(os.path.join(MODEL_DIR, "metadata.pkl"))
model = SentenceTransformer("all-MiniLM-L6-v2")
movie_id_to_idx = {mid: i for i, mid in enumerate(movie_ids)}
weights = {'genres': 1.0, 'keywords': 1.0, 'overview': 1.0, 'tagline': 0.5}

MONGODB_URI    = os.environ.get("MONGODB_URI")
print(MONGODB_URI)
client = MongoClient(MONGODB_URI)
db = client["test"]

TMDB_API_KEY = os.environ.get("TMDB_API_KEY")

def precompute_fallback():
    fallback_scores = []
    for mid in movie_ids:
        meta = metadata.get(mid, {})
        pop = meta.get("popularity", 0.0)
        wr = meta.get("wr", 0.0)
        score = 0.5*pop+0.5*wr
        fallback_scores.append((mid, score))
    fallback_scores.sort(key=lambda x: x[1], reverse=True)
    top_12 = [mid for mid, _ in fallback_scores[:12]]
    joblib.dump(top_12, os.path.join(MODEL_DIR, "cached_fallback.pkl"))
    return top_12


def fetch_movie_features(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&language=en-US"
    res = requests.get(url)
    if res.status_code != 200:
        return None
    data = res.json()
    genres = ', '.join([item['name'] for item in data["genres"]])
    tagline = data.get('tagline', '')
    overview = data.get('overview', '')
    keywords = fetch_keywords(movie_id)
    release_date = data.get("release_date", "")
    try:
        year = int(release_date.split("-")[0])
        release_decade = (year // 10) * 10
    except:
        release_decade = 0

    language = data.get("original_language", "Unknown")
    return {
        "genres": genres,
        "keywords": keywords,
        "overview": overview,
        "tagline": tagline,
        "release_decade": release_decade,
        "language": language
    }

def fetch_keywords(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/keywords?api_key={TMDB_API_KEY}"
    res = requests.get(url)
    if res.status_code != 200:
        return ""
    data = res.json()
    return ", ".join([k['name'] for k in data.get('keywords', [])])

def generate_avg_embedding(movie_ids_list):
    embeddings_list = []
    decades = []
    languages = []
    for movie_id in movie_ids_list:
        int_id = int(movie_id)
        if int_id in movie_ids:
            idx = movie_id_to_idx[int_id]
            print(f"[INFO] Found movie {int_id} in embeddings.pkl + metadata.pkl")
            emb = embeddings[idx]
            embeddings_list.append(emb)

            meta = metadata.get(int_id, {})
            decades.append(meta.get("decade", 0))
            languages.append(meta.get("language", "Unknown"))
            continue

        cached = db.movie_features.find_one({"_id": movie_id})
        if cached:
            print(f"[CACHE] Found movie {movie_id} in MongoDB cache")
            embeddings_list.append(np.array(cached["embedding"]))
            decades.append(cached["decade"])
            languages.append(cached["language"])
            continue
        features = fetch_movie_features(movie_id)
        if not features:
            print(f"[WARN] Could not fetch movie {movie_id}")
            continue
        decades.append(features.get("release_decade", 0))
        languages.append(features.get("language", "Unknown"))
        texts = [
            features.get('genres', ''),
            features.get('keywords', ''),
            features.get('overview', ''),
            features.get('tagline', '')
        ]   
        field_embs = model.encode(texts, normalize_embeddings=True)

        weighted_emb = (
            field_embs[0] * weights['genres'] +
            field_embs[1] * weights['keywords'] +
            field_embs[2] * weights['overview'] +
            field_embs[3] * weights['tagline']
        )
        embeddings_list.append(weighted_emb)
        db.movie_features.replace_one(
            {"_id": movie_id},{
        "_id": movie_id,
        "embedding": weighted_emb.tolist(),
        "language": features["language"],
        "decade": features["release_decade"]
        }, upsert=True)
    if not embeddings_list:
        return None
    return np.mean(embeddings_list, axis=0).reshape(1, -1), decades, languages

if os.path.exists(fallback_path):
    cached_fallback = joblib.load(fallback_path)
else:
    cached_fallback = precompute_fallback()


@app.route("/recommend/group/<string:group_id>")
def recommend_group(group_id):
    try:
        group_object_id = ObjectId(group_id)
        docs = list(db.histories.find({"group": group_object_id}, {"_id": 0, "watchedMovie": 1}).sort("createdAt", -1))

        seen = set()
        unique_ids = []
        for doc in docs:
            movie_id = doc.get("watchedMovie")
            if movie_id and movie_id not in seen:
                seen.add(movie_id)
                unique_ids.append(movie_id)
            if len(unique_ids) >= 20:
                break

        if not unique_ids:
            print("[INFO] No movies watched, Sending fallback data", flush=True)
            return jsonify(cached_fallback)
            # return jsonify(movie_ids[:12])

        avg_embedding, decades, languages = generate_avg_embedding(unique_ids)
        if avg_embedding is None:
            return jsonify({"error": "Failed to compute average embedding"}), 500

        ref_decade = int(np.mean(decades)) if decades else 2000
        ref_lang_counts = Counter(languages).most_common(1)
        ref_lang = ref_lang_counts[0][0] if ref_lang_counts else "Unknown"

        similarities = cosine_similarity(avg_embedding, embeddings)[0]
        scored = []

        for i, sim in enumerate(similarities):
            mid = movie_ids[i]
            if str(mid) in seen:
                continue

            meta = metadata.get(mid, {})
            pop_score = meta.get("popularity", 0.0)
            wr_score = meta.get("wr", 0.0)
            lang = meta.get("language", "")
            decade = int(meta.get("decade", 0))

            lang_bonus = 1.0 if lang == ref_lang else 0.0
            decade_penalty = abs(decade - ref_decade) / 50.0
            decade_score = 1.0 - min(decade_penalty, 1.0)

            final_score = (
                0.45 * sim +
                0.20 * wr_score +
                0.1 * pop_score +
                0.3 * lang_bonus +
                0.03 * decade_score
            )
            scored.append((mid, final_score))

        scored.sort(key=lambda x: x[1], reverse=True)
        top_recommendations = [mid for mid, _ in scored[:12]]
        return jsonify(top_recommendations)

    except Exception as e:
        print(f"[ERROR] {e}", flush=True)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
