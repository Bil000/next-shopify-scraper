export default function Home() {
    const startScraping = async () => {
      const response = await fetch("/api/scrape", { method: "POST", body: JSON.stringify({ query: "ecommerce" }), headers: { "Content-Type": "application/json" } });
      const result = await response.json();
      alert(result.message || result.error);
    };
    return <button onClick={startScraping}>Start Scraping</button>;
  }
  