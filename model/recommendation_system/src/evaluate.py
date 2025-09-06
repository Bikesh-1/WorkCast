import pandas as pd
import os
from recommender import content_based_recommendations, hybrid_recommendations

# Directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROCESSED_DIR = os.path.join(BASE_DIR, "../data/processed")
RESULTS_DIR = os.path.join(BASE_DIR, "../data/results")
os.makedirs(RESULTS_DIR, exist_ok=True)

# Load preprocessed data
users = pd.read_csv(os.path.join(PROCESSED_DIR, "users.csv"))
courses = pd.read_csv(os.path.join(PROCESSED_DIR, "courses.csv"))
interactions = pd.read_csv(os.path.join(PROCESSED_DIR, "interactions.csv"))

# -------- Evaluation Metrics --------
def precision_at_k(recommended, actual, k=5):
    recommended = recommended[:k]
    return len(set(recommended) & set(actual)) / k

def recall_at_k(recommended, actual, k=5):
    recommended = recommended[:k]
    return len(set(recommended) & set(actual)) / len(actual) if len(actual) > 0 else 0

def MAP_at_k(recommended, actual, k=5):
    recommended = recommended[:k]
    score = 0
    num_hits = 0
    for i, rec in enumerate(recommended):
        if rec in actual:
            num_hits += 1
            score += num_hits / (i + 1)
    return score / min(len(actual), k) if len(actual) > 0 else 0

# -------- Evaluation Function --------
def evaluate(users, courses, interactions, recommender_fn, top_n=5):
    results = []
    for user_id in users["user_id"]:
        try:
            recs = recommender_fn(user_id, users, courses, interactions, top_n=top_n)
            if recs.empty or "course_id" not in recs.columns:
                continue
            actual = interactions[interactions["user_id"] == user_id]["course_id"].tolist()
            results.append({
                "user_id": user_id,
                "precision": precision_at_k(recs["course_id"].tolist(), actual, k=top_n),
                "recall": recall_at_k(recs["course_id"].tolist(), actual, k=top_n),
                "MAP": MAP_at_k(recs["course_id"].tolist(), actual, k=top_n)
            })
        except Exception as e:
            print(f"Skipping user {user_id} due to error: {e}")
            continue
    return pd.DataFrame(results)

# -------- Main --------
if __name__ == "__main__":
    print("🔹 Evaluating Content-based...")
    content_results = evaluate(users, courses, interactions, content_based_recommendations)
    print(content_results.describe())

    print("\n🔹 Evaluating Hybrid...")
    hybrid_results = evaluate(users, courses, interactions, hybrid_recommendations)
    print(hybrid_results.describe())

    # Save results
    content_results.to_csv(os.path.join(RESULTS_DIR, "content_results.csv"), index=False)
    hybrid_results.to_csv(os.path.join(RESULTS_DIR, "hybrid_results.csv"), index=False)
    print("✅ Evaluation results saved in:", RESULTS_DIR)
