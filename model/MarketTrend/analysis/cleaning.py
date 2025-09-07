import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from bs4 import BeautifulSoup
from langdetect import detect, LangDetectException
import os

# Download required NLTK data only once
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

def clean_job_data(input_csv='data/all_jobs.csv', output_csv='data/cleaned_jobs.csv'):
    df = pd.read_csv(input_csv)

    df['combined_text'] = df[['title', 'description']].fillna('').agg(' '.join, axis=1)

    # Keep only English posts
    df['is_english'] = df['combined_text'].apply(is_english)
    df = df[df['is_english']]

    df['clean_text'] = df['combined_text'].apply(clean_text)
    df['clean_title'] = df['title'].apply(clean_text)
    df['clean_description'] = df['description'].apply(clean_text)

    os.makedirs(os.path.dirname(output_csv), exist_ok=True)
    df.to_csv(output_csv, index=False)
    print(f"Cleaned English-only data saved to {output_csv}")

if __name__ == "__main__":
    clean_job_data()
