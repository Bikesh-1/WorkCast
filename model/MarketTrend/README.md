# Job Market Trend Analysis - Hackathon Project

This project scrapes job listings from LinkedIn, Naukri, and Unstop, then analyzes job market trends with NLP.

## Structure
- `scrapers/`: site-specific scrapers
- `data/jobs.csv`: collected job listings
- `trend_analysis.py`: pipeline for extracting keywords and trends
- `results/plots/`: saved trend plots
- `app.py`: Streamlit dashboard to explore trends

## Usage

1. Run scrapers to collect data.
2. Run trend_analysis.py to process & analyze data.
3. Run Streamlit app: `streamlit run app.py`

