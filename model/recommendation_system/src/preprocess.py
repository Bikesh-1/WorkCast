import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
import os

# Directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(BASE_DIR, "data", "raw")
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
os.makedirs(PROCESSED_DIR, exist_ok=True)

# -------- Users --------
def preprocess_users(user_path=os.path.join(RAW_DIR, "users.csv"),
                     save_path=os.path.join(PROCESSED_DIR, "users.csv")):
    users = pd.read_csv(user_path)

    # Convert skills string -> list
    users["skills_list"] = users["skills"].apply(lambda x: x.split(", "))

    # Normalize numeric features
    scaler = MinMaxScaler()
    users[["age", "experience_years"]] = scaler.fit_transform(users[["age", "experience_years"]])

    users.to_csv(save_path, index=False)
    return users

# -------- Courses --------
def preprocess_courses(course_path=os.path.join(RAW_DIR, "courses.csv"),
                       save_path=os.path.join(PROCESSED_DIR, "courses.csv")):
    courses = pd.read_csv(course_path)

    # Text features (title + topic + tags)
    courses["text_features"] = courses["title"] + " " + courses["topic"] + " " + courses["tags"]

    # TF-IDF embeddings
    tfidf = TfidfVectorizer(max_features=500)
    tfidf_matrix = tfidf.fit_transform(courses["text_features"])

    # Normalize numeric columns
    scaler = MinMaxScaler()
    courses[["duration_hours", "cost_usd", "popularity"]] = scaler.fit_transform(
        courses[["duration_hours", "cost_usd", "popularity"]]
    )

    courses.to_csv(save_path, index=False)
    return courses, tfidf_matrix

# -------- Interactions --------
def preprocess_interactions(interaction_path=os.path.join(RAW_DIR, "interactions.csv"),
                            save_path=os.path.join(PROCESSED_DIR, "interactions.csv")):
    interactions = pd.read_csv(interaction_path)
    
    # Fill missing columns
    if "rating" not in interactions.columns:
        interactions["rating"] = 1
    if "clicks" not in interactions.columns:
        interactions["clicks"] = 0
    if "progress" not in interactions.columns:
        interactions["progress"] = 0

    # Engagement score (weighted)
    interactions["engagement_score"] = (
        interactions["rating"]*0.5 +
        interactions["clicks"]*0.2 +
        interactions["progress"]*0.3
    )

    interactions.to_csv(save_path, index=False)
    return interactions

# -------- Main --------
if __name__ == "__main__":
    users = preprocess_users()
    courses, tfidf_matrix = preprocess_courses()
    interactions = preprocess_interactions()
    print("✅ Processed data saved in:", PROCESSED_DIR)
