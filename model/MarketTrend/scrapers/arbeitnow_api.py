from scrapers.base_scraper import BaseScraper
import logging
import time

class ArbeitnowScraper(BaseScraper):
    def scrape_jobs(self):
        url = "https://www.arbeitnow.com/api/job-board-api"
        try:
            logging.info(f"Fetching Arbeitnow jobs from API")
            response = self.session.get(url, headers=self.get_random_headers(), timeout=15)
            response.raise_for_status()
            data = response.json()
            jobs = []
            for job in data.get('data', []):
                jobs.append({
                    'title': job.get('title', ''),
                    'company': job.get('company_name', ''),
                    'location': job.get('location', ''),
                    'experience': '',
                    'description': job.get('description', ''),
                    'source': 'Arbeitnow'
                })
            logging.info(f"Scraped {len(jobs)} jobs from Arbeitnow API.")
            time.sleep(3)  # polite delay
            return jobs
        except Exception as e:
            logging.error(f"Error fetching Arbeitnow API jobs: {e}")
            return []
