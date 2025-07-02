import pandas as pd
import joblib
import json
from sentence_transformers import SentenceTransformer
import os
import numpy as np
from sklearn.preprocessing import MinMaxScaler

MODEL_DIR = os.path.join(os.path.dirname(__file__), "../models")
os.makedirs(MODEL_DIR, exist_ok=True)

def extract_names(json_str):
    try:    
        return ', '.join([item['name'] for item in json.loads(json_str)])
    except:
        return ''

def process_movie_csv(input_csv='tmdb_5000_movies.csv', output_csv='processed.csv'):
    df = pd.read_csv(input_csv)

    df = df[['id', 'genres', 'keywords', 'overview', 'tagline', 'original_language', 'release_date', 'popularity', 'vote_average', 'vote_count']]

    df['genres'] = df['genres'].apply(extract_names)
    df['keywords'] = df['keywords'].apply(extract_names)

    df.fillna({'overview': '', 'tagline': '', 'original_language': 'Unknown', 'popularity': 0.0, 'vote_average': 0.0, 'vote_count': 0}, inplace=True)

    # Normalize popularity and compute WR (weighted rating)
    C = df['vote_average'].mean()
    m = df['vote_count'].quantile(0.60)

    def compute_wr(row):
        v = row['vote_count']
        R = row['vote_average']
        return (v / (v + m)) * R + (m / (m + v)) * C

    df['wr'] = df.apply(compute_wr, axis=1)

    pop_scaler = MinMaxScaler()
    df['popularity_scaled'] = pop_scaler.fit_transform(df[['popularity']])

    wr_scaler = MinMaxScaler()
    df['wr_scaled'] = wr_scaler.fit_transform(df[['wr']])


    df['release_year'] = pd.to_datetime(df['release_date'], errors='coerce').dt.year.fillna(0).astype(int)
    df['release_decade'] = df['release_year'].apply(lambda y: (y // 10) * 10 if y > 0 else 0)

    df[['id', 'genres', 'keywords', 'overview', 'tagline', 'original_language', 'release_decade', 'popularity_scaled', 'wr_scaled']].to_csv(output_csv, index=False)
    print(f"✅ Processed CSV saved as '{output_csv}'")
    return df

def generate_semantic_embeddings(df, model):
    fields = ['genres', 'keywords', 'overview', 'tagline']
    weights = {'genres': 1.0, 'keywords': 1.0, 'overview': 1.0, 'tagline': 0.5}
    total = sum(weights.values())
    weights = {k: v / total for k, v in weights.items()}

    combined_embeddings = []

    for field in fields:
        print(f"🔤 Encoding {field}...")
        embeddings = model.encode(df[field].tolist(), show_progress_bar=True, normalize_embeddings=True)
        embeddings = np.array(embeddings) * weights[field]
        combined_embeddings.append(embeddings)

    final_embeddings = np.sum(combined_embeddings, axis=0)
    return final_embeddings

def main():
    df = process_movie_csv()
    model = SentenceTransformer("all-MiniLM-L6-v2")
    final_embeddings = generate_semantic_embeddings(df, model)

    joblib.dump(final_embeddings, os.path.join(MODEL_DIR, "embeddings.pkl"))
    joblib.dump(df["id"].tolist(), os.path.join(MODEL_DIR, "movie_ids.pkl"))

    metadata = {
        row["id"]: {
            "popularity": row["popularity_scaled"],
            "wr": row["wr_scaled"],
            "language": row["original_language"],
            "decade": row["release_decade"]
        }
        for _, row in df.iterrows()
    }

    joblib.dump(metadata, os.path.join(MODEL_DIR, "metadata.pkl"))
    print("✅ Embeddings, IDs, and metadata saved.")

if __name__ == "__main__":
    main()
