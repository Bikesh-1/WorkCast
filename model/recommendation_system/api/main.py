from fastapi import FastAPI
from src.recommender import content_based_recommendations, hybrid_recommendations
import pandas as pd

app = FastAPI()

# load data once
users = pd.read_csv("data/raw/users.csv")
courses = pd.read_csv("data/raw/courses.csv")
interactions = pd.read_csv("data/raw/interactions.csv")

@app.get("/")
def home():
    return {"msg": "Recommendation API is running!"}

@app.get("/recommendations/content/{user_id}")
def get_content_recs(user_id: int, top_n: int = 5):
    recs = content_based_recommendations(user_id, users, courses, interactions, top_n)
    return recs.to_dict(orient="records")

@app.get("/recommendations/hybrid/{user_id}")
def get_hybrid_recs(user_id: int, top_n: int = 5):
    recs = hybrid_recommendations(user_id, users, courses, interactions, top_n)
    return recs.to_dict(orient="records")
