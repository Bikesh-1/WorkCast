import logging
import os
import pandas as pd
from scrapers.arbeitnow_api import ArbeitnowScraper
from scrapers.remotive_api import RemotiveScraper
from scrapers.weworkremotely_scraper import WeWorkRemotelyScraper

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s: %(message)s")

def run_all_scrapers():
    all_jobs = []

    all_jobs.extend(ArbeitnowScraper().scrape_jobs())

    all_jobs.extend(RemotiveScraper().scrape_jobs())

    all_jobs.extend(WeWorkRemotelyScraper().scrape_jobs())

    if all_jobs:
        os.makedirs('data', exist_ok=True)
        df = pd.DataFrame(all_jobs)
        df.to_csv('data/all_jobs.csv', index=False)
        logging.info(f"Saved {len(df)} jobs to data/all_jobs.csv")
    else:
        logging.warning("No jobs scraped from any source.")

if __name__ == "__main__":
    run_all_scrapers()
