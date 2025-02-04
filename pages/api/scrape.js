import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { appendToSheet } from '../../utils/googleSheets';

// Function to get Shopify stores from MyIP.ms
const getShopifyStores = async () => {
  const url = 'https://myip.ms/browse/sites/1/owned_by_Shopify_Inc/1';
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  let stores = [];
  $('tr[class^="row"] td:nth-child(1) a').each((i, el) => {
    const domain = $(el).text().trim();
    if (domain.includes('.')) {
      stores.push({ domain });
    }
  });

  return stores.slice(0, 10); // Limit to 10 stores per run
};

// Function to get emails from website
const getEmailsFromWebsite = async (domain) => {
  try {
    const response = await fetch(`https://${domain}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    const emails = [];
    $('a[href^="mailto:"]').each((i, el) => {
      const email = $(el).attr('href').replace('mailto:', '').trim();
      if (email.includes('@gmail.com')) {
        emails.push(email);
      }
    });

    return emails.length ? emails : ['No email found'];
  } catch (error) {
    return ['Error fetching website'];
  }
};

// API Route
export default async function handler(req, res) {
  try {
    const stores = await getShopifyStores();
    const data = [];

    for (const store of stores) {
      const emails = await getEmailsFromWebsite(store.domain);
      const row = [store.domain, ...emails]; // Add domain and emails to the row
      data.push(row);

      // Append to Google Sheets
      await appendToSheet(data);
    }

    res.status(200).json({ message: 'Scraping done', newLeads: stores.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape data' });
  }
}
