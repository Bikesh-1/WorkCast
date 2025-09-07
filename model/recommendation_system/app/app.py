# app/app.py
import streamlit as st
import requests
import pandas as pd

# Base URL of your deployed API
<<<<<<< HEAD
  # Change this to your Render URL once deployed
=======
BASE_URL = "https://workcast-qizn.onrender.com"
>>>>>>> 1319d4b0de0837c091e6cba1fbb84162b55c7441

st.title("WorkCast Course Recommendations")

# Input user ID
user_id = st.text_input("Enter your User ID (e.g., user_1):")
# Input number of recommendations
top_n = st.number_input("How many recommendations?", min_value=1, max_value=20, value=5)

if st.button("Get Recommendations"):
    if not user_id:
        st.warning("⚠️ Please enter a user ID")
    else:
        try:
            # Build API URL
            api_url = f"{BASE_URL}/recommendations/{user_id}?top_n={top_n}"

            # GET request to FastAPI backend
            response = requests.get(api_url)
            response.raise_for_status()

            recs = response.json()

            if recs and "recommendations" in recs:
                df = pd.DataFrame(recs["recommendations"])
                st.subheader(f"📚 Top {recs['top_n']} Recommendations for {recs['user_id']}")
                st.dataframe(df)
            else:
                st.info("ℹ️ No recommendations found for this user.")

        except requests.exceptions.RequestException as e:
            st.error(f"❌ Error connecting to API: {e}")
