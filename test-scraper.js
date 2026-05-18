const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function test() {
  console.log("Starting puppeteer...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Try 26-May-2024 or whatever date the user meant. Wait, what is the current date?
  // The user says "closest real flight is on 26". 26 of what month? May?
  // Let's check flight from ADE to CAI on 26-May-2024 or 26-May-2026? We are in 2026.
  const url = 'https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=ADE-CAI&journey=26-May-2026';
  
  console.log("Navigating to:", url);
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  const html = await page.content();
  console.log("Page loaded, length:", html.length);
  
  const flights = await page.evaluate(() => {
     // Let's just grab all text that looks like a flight or prices
     return document.body.innerText;
  });
  
  const fs = require('fs');
  fs.writeFileSync('A:\\Alqadi\\web\\scrape-output.txt', html);
  fs.writeFileSync('A:\\Alqadi\\web\\scrape-text.txt', flights);
  
  console.log("Done.");
  await browser.close();
}

test().catch(console.error);
