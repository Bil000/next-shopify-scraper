# Next Shopify Scraper

## Description
This project scrapes Shopify stores, extracts emails, and stores them in a Google Sheet using Google Sheets API.

## Steps to Set Up

1. Clone the repository.
2. Set up Google Sheets API on the [Google Developer Console](https://console.developers.google.com/).
3. Add your **Google Sheets API credentials** as an environment variable (`GOOGLE_SHEET_API_CREDENTIALS`) in **Vercel**.
4. Deploy the project to **Vercel**.
5. Set up a **GitHub Action** to run the scraper at regular intervals (every 6 hours).

## Dependencies
- Next.js
- Firebase Admin SDK (Optional for tracking lead count)
- Google APIs (for Google Sheets integration)
- Cheerio (for web scraping)
