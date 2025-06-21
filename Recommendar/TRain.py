import pandas as pd
import ast
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib

# Load CSV
df = pd.read_csv("tmdb_5000_movies.csv")  # Ensure the file is in your VS Code folder

# Preprocessing
def extract_names(text):
    try:
        return ' '.join([d['name'].replace(" ", "") for d in ast.literal_eval(text)])
    except:
        return ''

df['genres'] = df['genres'].apply(extract_names)
df['keywords'] = df['keywords'].apply(extract_names)
df['tagline'] = df['tagline'].fillna('')
df['runtime'] = df['runtime'].fillna(df['runtime'].mean()).astype(int)

# Combine features
df['combined_features'] = (
    df['genres'] + ' ' +
    df['keywords'] + ' ' +
    df['tagline']
)

# Train TF-IDF
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['combined_features'])

# Save files
df.to_csv("processed_movies.csv", index=False)
print("✅ CSV saved")

joblib.dump(tfidf, "tfidf_vectorizer.pkl")
print("✅ TFIDF Vectorizer saved")

joblib.dump(tfidf_matrix, "tfidf_matrix.pkl")
print("✅ TFIDF Matrix saved")

print("✅ Saved: processed_movies.csv, tfidf_vectorizer.pkl, tfidf_matrix.pkl")
