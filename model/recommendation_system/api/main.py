from fastapi import FastAPI
import pickle
from src.recommender import content_based_recommendations, hybrid_recommendations

app = FastAPI()

# Load pre-saved objects
with open("model/users.pkl", "rb") as f:
    users = pickle.load(f)

with open("model/courses.pkl", "rb") as f:
    courses = pickle.load(f)

with open("model/interactions.pkl", "rb") as f:
    interactions = pickle.load(f)

@app.get("/")
def home():
    return {"msg": "Recommendation API is running with Pickle!"}

@app.get("/recommendations/content/{user_id}")
def get_content_recs(user_id: int, top_n: int = 5):
    recs = content_based_recommendations(user_id, users, courses, interactions, top_n)
    return recs.to_dict(orient="records")

@app.get("/recommendations/hybrid/{user_id}")
def get_hybrid_recs(user_id: int, top_n: int = 5):
    recs = hybrid_recommendations(user_id, users, courses, interactions, top_n)
    return recs.to_dict(orient="records")
