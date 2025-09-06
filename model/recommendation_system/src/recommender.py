# src/recommender.py
import pandas as pd

# -------- Content-based --------
def content_based_recommendations(user_id, users, courses, interactions=None, top_n=5):
    user_skills = set(users.loc[users["user_id"] == user_id, "skills_list"].values[0])

    def score_course(row):
        course_skills = set(row["tags"].split(", ")) if pd.notnull(row["tags"]) else set()
        return len(user_skills & course_skills)

    courses["content_score"] = courses.apply(score_course, axis=1)

    # Optional: boost by average engagement
    if interactions is not None:
        avg_engagement = interactions.groupby("course_id")["engagement_score"].mean()
        courses["avg_engagement"] = courses["course_id"].map(avg_engagement).fillna(0)
        courses["content_score"] += courses["avg_engagement"]

    recs = courses.sort_values("content_score", ascending=False).head(top_n)
    recs["user_id"] = user_id
    return recs[["course_id", "title", "content_score", "user_id"]]

# -------- Hybrid --------
def hybrid_recommendations(user_id, users, courses, interactions, top_n=5):
    content = content_based_recommendations(user_id, users, courses, interactions, top_n=top_n)

    # Use average engagement as collaborative hint
    avg_engagement = interactions.groupby("course_id")["engagement_score"].mean()
    content["collab_score"] = content["course_id"].map(avg_engagement).fillna(0)

    # Hybrid score = mean of content and collaborative hints
    content["hybrid_score"] = (content["content_score"] + content["collab_score"]) / 2
    hybrid = content.sort_values("hybrid_score", ascending=False).head(top_n)
    return hybrid[["course_id", "title", "hybrid_score", "user_id"]]

# -------- Wrapper Class --------
class Recommender:
    def __init__(self):
        # Load your CSVs here (adjust paths if needed)
        self.users = pd.read_csv("data/users.csv")
        self.courses = pd.read_csv("data/courses.csv")
        self.interactions = pd.read_csv("data/interactions.csv")

    def recommend(self, user_id: int, skills: list[str] = [], past_courses: list[str] = [], top_n: int = 5):
        # Right now: use hybrid method
        recs = hybrid_recommendations(user_id, self.users, self.courses, self.interactions, top_n)
        # Convert to dictionary list for API response
        return recs.to_dict(orient="records")
