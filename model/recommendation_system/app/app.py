import streamlit as st
import requests
import pandas as pd

# Local API URL
BASE_URL = "http://127.0.0.1:8000"

st.title("WorkCast Course Recommendations")

user_id = st.text_input("Enter your User ID (e.g., user_1):")
top_n = st.number_input("How many recommendations?", min_value=1, max_value=20, value=5)

if st.button("Get Recommendations"):
    if not user_id:
        st.warning("⚠️ Please enter a user ID")
    else:
        try:
            api_url = f"{BASE_URL}/recommendations/{user_id}?top_n={top_n}"
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
