from fastapi import FastAPI
from src.recommender import Recommender
import os

app = FastAPI(title="Recommendation API")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
USERS_PATH = os.path.join(BASE_DIR, "model", "users.pkl")
COURSES_PATH = os.path.join(BASE_DIR, "model", "courses.pkl")
INTERACTIONS_PATH = os.path.join(BASE_DIR, "model", "interactions.pkl")

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
    try:
        recs = recommender.recommend(user_id=user_id, top_n=top_n)
        return {"user_id": user_id, "top_n": top_n, "recommendations": recs}
    except Exception as e:
        return {"error": str(e)}
