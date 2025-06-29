import pandas as pd
import ast
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
from datetime import datetime

# Load CSV
df = pd.read_csv("tmdb_5000_movies.csv")  # Ensure the file is in your VS Code folder

# Preprocessing
def extract_names(text):
    try:
        return ' '.join([d['name'].replace(" ", "") for d in ast.literal_eval(text)])
    except:
        return ''

def extract_year(release_date):
    try:
        if pd.isna(release_date) or release_date == '':
            return 'unknown'
        # Extract year from date string (format: YYYY-MM-DD)
        year = str(release_date).split('-')[0]
        return year
    except:
        return 'unknown'

def get_decade(year_str):
    try:
        year = int(year_str)
        decade = (year // 10) * 10
        return f"{decade}s"
    except:
        return 'unknown'

df['genres'] = df['genres'].apply(extract_names)
df['keywords'] = df['keywords'].apply(extract_names)
df['tagline'] = df['tagline'].fillna('')
df['runtime'] = df['runtime'].fillna(df['runtime'].mean()).astype(int)

# Extract year and decade information
df['year'] = df['release_date'].apply(extract_year)
df['decade'] = df['year'].apply(get_decade)

# Combine features with year information
df['combined_features'] = (
    df['genres'] + ' ' +
    df['keywords'] + ' ' +
    df['tagline'] + ' ' +
    df['year'] + ' ' +
    df['decade']
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
print(f"✅ Added year and decade features to improve recommendations")
print(f"✅ Sample years in dataset: {df['year'].value_counts().head(5).to_dict()}")
