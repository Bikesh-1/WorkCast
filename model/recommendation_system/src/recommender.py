import pandas as pd
import pickle
import os

class Recommender:
    def __init__(self, users_path, courses_path, interactions_path):
        # Load data
        with open(users_path, "rb") as f:
            self.users = pickle.load(f)
        with open(courses_path, "rb") as f:
            self.courses = pickle.load(f)
        with open(interactions_path, "rb") as f:
            self.interactions = pickle.load(f)

    def recommend(self, user_id, top_n=5):
        # Check if user exists
        if user_id not in self.users["user_id"].values:
            # If new user, recommend top popular courses
            popular_courses = self.interactions["course_id"].value_counts().head(top_n).index.tolist()
            recs = self.courses[self.courses["course_id"].isin(popular_courses)]
            return recs.to_dict(orient="records")

        # Courses user has interacted with
        seen_courses = self.interactions[self.interactions["user_id"] == user_id]["course_id"].tolist()

        # Recommend unseen courses
        unseen_courses = self.courses[~self.courses["course_id"].isin(seen_courses)]

        # If no unseen courses, fallback to top popular
        if unseen_courses.empty:
            popular_courses = self.interactions["course_id"].value_counts().head(top_n).index.tolist()
            recs = self.courses[self.courses["course_id"].isin(popular_courses)]
        else:
            recs = unseen_courses.head(top_n)

        return recs.to_dict(orient="records")
