import requests
import logging
import time

class RemotiveScraper:
    def scrape_jobs(self):
        url = "https://remotive.io/api/remote-jobs"
        try:
            logging.info("Fetching Remotive jobs")
            resp = requests.get(url, timeout=15)
            resp.raise_for_status()
            data = resp.json()
            jobs = []
            for job in data.get('jobs', []):
                jobs.append({
                    'title': job.get('title', ''),
                    'company': job.get('company_name', ''),
                    'location': job.get('candidate_required_location', ''),
                    'experience': '',
                    'description': job.get('description', ''),
                    'url': job.get('url', ''),
                    'source': 'Remotive'
                })
            time.sleep(2)
            return jobs
        except Exception as e:
            logging.error(f"Remotive API error: {e}")
            return []
