import { db, collection, addDoc, getCountFromServer } from "../../lib/firebase";
import puppeteer from "puppeteer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const searchQuery = req.body.query || "store";
  const maxLeads = 1000;
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`https://myip.ms/browse/sites/${searchQuery}`);
    
    const data = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("table tr"))
        .map(row => {
          const cols = row.querySelectorAll("td");
          return cols.length > 2 ? { name: cols[1]?.innerText, email: cols[2]?.innerText } : null;
        })
        .filter(entry => entry && entry.email.includes("@gmail.com"));
    });
    
    await browser.close();
    
    for (const lead of data) {
      const leadsRef = collection(db, "leads");
      const countSnapshot = await getCountFromServer(leadsRef);
      if (countSnapshot.data().count >= maxLeads) break;
      await addDoc(leadsRef, lead);
    }
    
    res.status(200).json({ message: "Scraping completed and leads saved." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
