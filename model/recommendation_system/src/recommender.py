import pandas as pd
import pickle
from typing import List

def content_based_recommendations(user_id: int, users: pd.DataFrame, courses: pd.DataFrame, interactions: pd.DataFrame = None, top_n: int = 5):
    # Adjust column name according to your users.pkl
    user_skills_column = "skills"  # Change to actual column name in users.pkl
    user_skills = set(users.loc[users["user_id"] == user_id, user_skills_column].values[0])

    def score_course(row):
        course_skills = set(row["tags"].split(", ")) if pd.notnull(row["tags"]) else set()
        return len(user_skills & course_skills)

    courses["content_score"] = courses.apply(score_course, axis=1)

    if interactions is not None:
        avg_engagement = interactions.groupby("course_id")["engagement_score"].mean()
        courses["avg_engagement"] = courses["course_id"].map(avg_engagement).fillna(0)
        courses["content_score"] += courses["avg_engagement"]

    recs = courses.sort_values("content_score", ascending=False).head(top_n)
    recs["user_id"] = user_id
    return recs[["course_id", "title", "content_score", "user_id"]]

def hybrid_recommendations(user_id: int, users: pd.DataFrame, courses: pd.DataFrame, interactions: pd.DataFrame, top_n: int = 5):
    content = content_based_recommendations(user_id, users, courses, interactions, top_n=top_n)

    avg_engagement = interactions.groupby("course_id")["engagement_score"].mean()
    content["collab_score"] = content["course_id"].map(avg_engagement).fillna(0)

    content["hybrid_score"] = (content["content_score"] + content["collab_score"]) / 2
    hybrid = content.sort_values("hybrid_score", ascending=False).head(top_n)
    return hybrid[["course_id", "title", "hybrid_score", "user_id"]]

class Recommender:
    def __init__(self, users_path="../model/users.pkl", courses_path="../model/courses.pkl", interactions_path="../model/interactions.pkl"):
        with open(users_path, "rb") as f:
            self.users = pickle.load(f)
        with open(courses_path, "rb") as f:
            self.courses = pickle.load(f)
        with open(interactions_path, "rb") as f:
            self.interactions = pickle.load(f)

    def recommend(self, user_id: int, top_n: int = 5):
        recs = hybrid_recommendations(user_id, self.users, self.courses, self.interactions, top_n)
        return recs.to_dict(orient="records")
