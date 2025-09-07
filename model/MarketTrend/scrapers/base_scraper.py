import requests
import time
import random
import logging

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.111 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20100101 Firefox/113.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15",
]

class BaseScraper:
    def __init__(self):
        self.session = requests.Session()

    def get_random_headers(self):
        return {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept-Language": "en-US,en;q=0.9"
        }

    def fetch_url(self, url, params=None, retries=3, delay=2):
        for attempt in range(1, retries + 1):
            try:
                logging.info(f"Fetching URL: {url} attempt {attempt}")
                response = self.session.get(url, headers=self.get_random_headers(), params=params, timeout=15)
                response.raise_for_status()
                time.sleep(random.uniform(delay, delay + 2))
                return response
            except Exception as e:
                logging.warning(f"Attempt {attempt} failed: {e}")
                time.sleep(delay)
        logging.error(f"Failed to fetch URL after {retries} attempts: {url}")
        return None
