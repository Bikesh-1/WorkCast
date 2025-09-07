from fastapi import FastAPI
from src.recommender import Recommender
import os

app = FastAPI(title="Recommendation API")

# --- Paths ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # recommendation_system/
USERS_PATH = os.path.join(BASE_DIR, "model", "users.pkl")
COURSES_PATH = os.path.join(BASE_DIR, "model", "courses.pkl")
INTERACTIONS_PATH = os.path.join(BASE_DIR, "model", "interactions.pkl")

# --- Initialize recommender ---
recommender = Recommender(
    users_path=USERS_PATH,
    courses_path=COURSES_PATH,
    interactions_path=INTERACTIONS_PATH
)

@app.get("/")
def home():
    return {"msg": "Recommendation API is running!"}


@app.get("/recommendations/{user_id}")
def get_recommendations(user_id: str, top_n: int = 5):
    """
    Get top-N course recommendations for a given user.

    user_id can be:
    - "user_1", "user_25" (string IDs from the dataset)
    - or just "1", "25" (will be automatically converted to "user_1", "user_25")
    """
    try:
        # Ensure correct format for synthetic dataset
        if not user_id.startswith("user_"):
            user_id = f"user_{user_id}"

        recs = recommender.recommend(user_id=user_id, top_n=top_n)
        return {"user_id": user_id, "top_n": top_n, "recommendations": recs}

    except KeyError as e:
        return {"error": f"Column missing: {str(e)}"}
    except IndexError:
        return {"error": f"User {user_id} not found in users data."}
    except Exception as e:
        return {"error": str(e)}
