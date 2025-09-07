import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import nltk
from bs4 import BeautifulSoup
from langdetect import detect, LangDetectException
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from scrapers.arbeitnow_api import ArbeitnowScraper
from scrapers.remotive_api import RemotiveScraper
from scrapers.weworkremotely_scraper import WeWorkRemotelyScraper
import os

# Setup NLTK once
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

EN_STOPWORDS = set(stopwords.words('english'))
CUSTOM_STOPWORDS = {'li', 'ul', 'br', 'http', 'https', 'href', 'class', 'div', 'span'}
STOPWORDS = EN_STOPWORDS.union(CUSTOM_STOPWORDS)
LEMMATIZER = WordNetLemmatizer()

def is_english(text):
    try:
        return detect(text) == 'en'
    except LangDetectException:
        return False

def clean_text(text):
    if pd.isna(text) or not isinstance(text, str):
        return ""

    text = BeautifulSoup(text, "html.parser").get_text(separator=" ")

    tokens = word_tokenize(text.lower())
    cleaned_tokens = [
        LEMMATIZER.lemmatize(token)
        for token in tokens
        if token.isalpha() and token not in STOPWORDS
    ]
    return " ".join(cleaned_tokens)

@st.cache_data(ttl=3600)
def fetch_live_jobs():
    all_jobs = []
    all_jobs.extend(ArbeitnowScraper().scrape_jobs())
    all_jobs.extend(RemotiveScraper().scrape_jobs())
    all_jobs.extend(WeWorkRemotelyScraper().scrape_jobs())
    df = pd.DataFrame(all_jobs)
    df.to_csv('data/all_jobs_live.csv', index=False)
    return df

@st.cache_data
def load_cleaned_data(df):
    # Combine title and description
    df['combined_text'] = df[['title', 'description']].fillna('').agg(' '.join, axis=1)

    # Filter English only
    df = df[df['combined_text'].apply(is_english)]

    # Clean text column
    df['clean_text'] = df['combined_text'].apply(clean_text)
    return df

def plot_top_keywords(df, top_n=15):
    from sklearn.feature_extraction.text import TfidfVectorizer

    texts = df['clean_text'].fillna('')
    vectorizer = TfidfVectorizer(max_features=50)
    tfidf_matrix = vectorizer.fit_transform(texts)
    summed = tfidf_matrix.sum(axis=0).A1
    keywords = vectorizer.get_feature_names_out()
    key_score = list(zip(keywords, summed))
    key_score.sort(key=lambda x: x[1], reverse=True)
    top_keywords = key_score[:top_n]

    words, scores = zip(*top_keywords)
    plt.figure(figsize=(10, 5))
    plt.bar(words, scores, color='teal')
    plt.title(f"Top {top_n} Job Market Keywords by TF-IDF")
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    st.pyplot(plt)
    plt.close()

def main():
    st.title("Job Market Trends Dashboard with Live Fetching")

    st.sidebar.header("Controls")
    if st.sidebar.button("Fetch Latest Jobs (Live)"):
        st.info("Fetching fresh job data — please wait...")
        df_raw = fetch_live_jobs()
        st.sidebar.success(f"Fetched {len(df_raw)} jobs live.")
    else:
        try:
            df_raw = pd.read_csv('data/all_jobs_live.csv')
            st.sidebar.info(f"Loaded cached live data with {len(df_raw)} jobs.")
        except Exception:
            st.sidebar.warning("No cached data found, fetching live data now...")
            df_raw = fetch_live_jobs()

    # Clean and filter
    df = load_cleaned_data(df_raw)
    st.sidebar.markdown(f"Filtered to {len(df)} English job listings after cleaning.")

    # Keyword filter
    keyword_filter = st.sidebar.text_input("Filter jobs by keyword in title or description")

    if keyword_filter:
        filtered_df = df[
            df['title'].str.contains(keyword_filter, case=False, na=False) |
            df['description'].str.contains(keyword_filter, case=False, na=False)
        ]
    else:
        filtered_df = df

    st.subheader("Job Listings Overview")
    st.write("Total jobs:", len(df_raw))
    st.write("English jobs after filtering:", len(df))
    st.write("Filtered jobs:", len(filtered_df))
    st.write("Unique companies:", filtered_df['company'].nunique())
    st.write("Unique locations:", filtered_df['location'].nunique())

    st.subheader("Top Keywords")
    plot_top_keywords(filtered_df)

    cols_to_show = ['title', 'company', 'location', 'source']
    if 'url' in filtered_df.columns:
        cols_to_show.append('url')

    st.subheader("Filtered Job Listings")
    st.dataframe(filtered_df[cols_to_show].reset_index(drop=True))

    csv = filtered_df.to_csv(index=False).encode('utf-8')
    st.download_button(
        label="Download filtered jobs CSV",
        data=csv,
        file_name='filtered_jobs.csv',
        mime='text/csv'
    )

if __name__ == "__main__":
    main()
