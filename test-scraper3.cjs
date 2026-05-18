const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' }); 
  const page = await browser.newPage();
  
  const origin = 'ADE';
  const destination = 'CAI';
  const date = '22-May-2026';
  const url = `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}&journey=${date}`;
  
  console.log("Navigating to", url);
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  try {
      const content = await page.content();
      const fs = require('fs');
      fs.writeFileSync('videcom-test.html', content);
      console.log("Saved videcom-test.html");
      
  } catch (err) {
      console.log("Error:", err.message);
  }
  
  await browser.close();
})();
