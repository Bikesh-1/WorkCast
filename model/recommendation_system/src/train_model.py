import pandas as pd
import pickle
from recommender import content_based_recommendations, hybrid_recommendations

# Load raw data
users = pd.read_csv("data/raw/users.csv")
courses = pd.read_csv("data/raw/courses.csv")
interactions = pd.read_csv("data/raw/interactions.csv")

# Save objects to pickle for fast loading
with open("model/users.pkl", "wb") as f:
    pickle.dump(users, f)

with open("model/courses.pkl", "wb") as f:
    pickle.dump(courses, f)

with open("model/interactions.pkl", "wb") as f:
    pickle.dump(interactions, f)

print("✅ Data pickled successfully!")
