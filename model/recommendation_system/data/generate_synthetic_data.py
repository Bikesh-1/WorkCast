import pandas as pd
import numpy as np
import random
import os
from faker import Faker

# Reproducibility
np.random.seed(42)
random.seed(42)
fake = Faker()

# Create folders
os.makedirs("raw", exist_ok=True)

# -------------------------
# 1. Users dataset
# -------------------------
user_ids = [f"U{i}" for i in range(1, 151)]  # 150 users
skills = ["Python", "Java", "SQL", "Machine Learning", "Deep Learning",
          "Data Science", "Cloud Computing", "Cybersecurity", "Web Development",
          "Mobile Dev", "AI", "C++", "DevOps", "Blockchain", "NLP", "Computer Vision"]

professions = ["Student", "Software Engineer", "Data Analyst", "ML Engineer",
               "Cloud Architect", "Cybersecurity Specialist", "Researcher", "Web Developer",
               "Business Analyst", "Professor"]

education_levels = ["High School", "Bachelor's", "Master's", "PhD"]
learning_styles = ["Self-paced", "Instructor-led", "Hybrid"]

interests = ["Finance", "Healthcare", "Gaming", "Robotics", "E-commerce",
             "Social Media", "Autonomous Systems", "Education", "Manufacturing"]

countries = ["India", "USA", "UK", "Germany", "Canada", "Australia", "Japan"]

users = []
for uid in user_ids:
    user_skills = random.sample(skills, k=random.randint(2, 6))
    user_interests = random.sample(interests, k=random.randint(1, 3))
    users.append({
        "user_id": uid,
        "name": fake.name(),
        "age": random.randint(18, 50),
        "profession": random.choice(professions),
        "education": random.choice(education_levels),
        "experience_years": random.randint(0, 15),
        "skills": ", ".join(user_skills),
        "learning_style": random.choice(learning_styles),
        "interests": ", ".join(user_interests),
        "country": random.choice(countries)
    })

users_df = pd.DataFrame(users)
users_df.to_csv("raw/users.csv", index=False)

# -------------------------
# 2. Courses dataset
# -------------------------
course_ids = [f"C{i}" for i in range(1, 81)]  # 80 courses
topics = ["Python", "SQL", "AI", "ML", "Web Dev", "Cloud", "Security",
          "Data Engineering", "Blockchain", "NLP", "Computer Vision", "DevOps", "Big Data"]

providers = ["Coursera", "edX", "Udemy", "DataCamp", "Pluralsight", "Skillshare"]
languages = ["English", "Hindi", "Spanish", "German", "French"]

courses = []
for cid in course_ids:
    topic = random.choice(topics)
    difficulty = random.choice(["Beginner", "Intermediate", "Advanced"])
    duration = random.randint(4, 80)  # hours
    courses.append({
        "course_id": cid,
        "title": f"{topic} Mastery {cid}",
        "topic": topic,
        "difficulty": difficulty,
        "duration_hours": duration,
        "provider": random.choice(providers),
        "language": random.choice(languages),
        "tags": ", ".join(random.sample(skills, k=random.randint(1, 3))),
        "cost_usd": random.choice([0, 20, 50, 100, 200]),
        "mode": random.choice(["Online", "Offline", "Hybrid"]),
        "release_year": random.randint(2015, 2025),
        "popularity": random.randint(50, 1000)  # enrollment count
    })

courses_df = pd.DataFrame(courses)
courses_df.to_csv("raw/courses.csv", index=False)

# -------------------------
# 3. Interactions dataset
# -------------------------
reviews = [
    "Great course, learned a lot!",
    "Too basic, but good for beginners.",
    "Well-structured and practical.",
    "Challenging but rewarding.",
    "Loved the instructor's style.",
    "Needs more real-world examples.",
    "Very interactive and engaging.",
    "Outdated content, needs refresh."
]

interactions = []
for uid in user_ids:
    taken_courses = random.sample(course_ids, k=random.randint(5, 20))
    for cid in taken_courses:
        rating = random.randint(1, 5)
        completed = random.choice([0, 1])
        time_spent = random.randint(1, 60)  # hours
        clicks = random.randint(1, 30)
        progress = random.randint(0, 100)  # %
        interactions.append({
            "user_id": uid,
            "course_id": cid,
            "rating": rating,
            "completed": completed,
            "time_spent": time_spent,
            "clicks": clicks,
            "progress": progress,
            "enrolled_on": fake.date_between(start_date='-2y', end_date='today'),
            "review": random.choice(reviews)
        })

interactions_df = pd.DataFrame(interactions)
interactions_df.to_csv("raw/interactions.csv", index=False)

print(" Super diverse synthetic data generated in data/raw/")
