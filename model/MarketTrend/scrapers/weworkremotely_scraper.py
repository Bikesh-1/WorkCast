import requests
from bs4 import BeautifulSoup
import logging
import time

class WeWorkRemotelyScraper:
    def scrape_jobs(self):
        url = "https://weworkremotely.com/categories/remote-programming-jobs"
        headers = {'User-Agent': 'Mozilla/5.0'}
        try:
            logging.info("Fetching We Work Remotely jobs")
            resp = requests.get(url, headers=headers, timeout=15)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, 'html.parser')
            jobs = []
            job_sections = soup.select('section.jobs article')
            for job_sec in job_sections:
                title_el = job_sec.select_one('span.title')
                company_el = job_sec.select_one('span.company')
                link_el = job_sec.select_one('a')
                jobs.append({
                    'title': title_el.get_text(strip=True) if title_el else '',
                    'company': company_el.get_text(strip=True) if company_el else '',
                    'location': 'Remote',
                    'experience': '',
                    'description': '',
                    'url': 'https://weworkremotely.com' + link_el['href'] if link_el else '',
                    'source': 'We Work Remotely'
                })
            time.sleep(2)
            return jobs
        except Exception as e:
            logging.error(f"We Work Remotely scraping error: {e}")
            return []
