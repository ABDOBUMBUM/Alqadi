const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  console.log("Navigating to Videcom...");
  await page.goto('https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=ADE-CAI&journey=26-May-2026', { waitUntil: 'networkidle2' });
  
  // Try to get flight data
  console.log("Waiting for Flight grid...");
  try {
      await page.waitForSelector('.FlightCalGrid', { timeout: 10000 });
      console.log("Flight grid found!");
      
      const flights = await page.evaluate(() => {
          const cells = document.querySelectorAll('.FlightCalGrid tr');
          const data = [];
          cells.forEach(row => {
              const text = row.innerText.trim();
              if(text && text.includes(':')) {
                  data.push(text.replace(/\s+/g, ' '));
              }
          });
          return data;
      });
      
      console.log("Flights found:", flights);
  } catch (err) {
      console.log("Error waiting for grid:", err.message);
      const content = await page.content();
      console.log("Content summary:", content.substring(0, 500));
  }
  
  await browser.close();
})();
