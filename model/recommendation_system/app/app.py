# app/app.py
import streamlit as st
import requests
import pandas as pd

# Base URL of your deployed API
API_URL = "https://workcast-qizn.onrender.com/recommendations/${userId}?top_n=${top_n}"  # Change this to your Render URL once deployed

st.title("WorkCast Course Recommendations")

# Input user ID
user_id = st.text_input("Enter your User ID:")

if st.button("Get Recommendations"):
    if not user_id:
        st.warning("Please enter a user ID")
    else:
        try:
            response = requests.post(API_URL, json={"user_id": user_id})
            response.raise_for_status()
            recs = response.json()
            if recs:
                df = pd.DataFrame(recs)
                st.subheader("Top Course Recommendations")
                st.dataframe(df)
            else:
                st.info("No recommendations found for this user.")
        except requests.exceptions.RequestException as e:
            st.error(f"Error connecting to API: {e}")
