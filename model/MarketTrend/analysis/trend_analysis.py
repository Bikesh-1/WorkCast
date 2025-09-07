import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import matplotlib.pyplot as plt
import os

def analyze_trends(cleaned_csv='data/cleaned_jobs.csv', output_csv='results/top_keywords.csv', plot_path='results/plots/top_keywords.png'):
    df = pd.read_csv(cleaned_csv)
    texts = df['clean_text'].fillna('')

    vectorizer = TfidfVectorizer(max_features=50)
    tfidf_matrix = vectorizer.fit_transform(texts)

    summed = tfidf_matrix.sum(axis=0).A1
    keywords = vectorizer.get_feature_names_out()
    keyword_scores = list(zip(keywords, summed))

    keyword_scores.sort(key=lambda x: x[1], reverse=True)

    os.makedirs(os.path.dirname(output_csv), exist_ok=True)
    pd.DataFrame(keyword_scores, columns=['keyword', 'tfidf_score']).to_csv(output_csv, index=False)
    print(f"Saved top keywords to {output_csv}")

    top_keywords = keyword_scores[:10]
    words, scores = zip(*top_keywords)

    os.makedirs(os.path.dirname(plot_path), exist_ok=True)
    plt.figure(figsize=(10, 6))
    plt.bar(words, scores, color='teal')
    plt.title('Top 10 Job Market Keywords by TF-IDF (English only)')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(plot_path)
    plt.close()
    print(f"Saved keyword plot to {plot_path}")

if __name__ == "__main__":
    analyze_trends()
