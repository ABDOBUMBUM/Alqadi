const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' }); 
  const page = await browser.newPage();
  
  // Set viewport to a realistic size
  await page.setViewport({ width: 1280, height: 800 });
  
  const origin = 'ADE';
  const destination = 'CAI';
  const date = '22-May-2026';
  const url = `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}&journey=${date}`;
  
  console.log("Navigating to", url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  
  // Wait a little bit for any protections to clear
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
      await page.screenshot({ path: 'screenshot.png', fullPage: true });
      console.log("Saved screenshot.png");
      
      const fs = require('fs');
      fs.writeFileSync('videcom.html', await page.content());
      console.log("Saved videcom.html");
  } catch (err) {
      console.log("Error:", err.message);
  }
  
  await browser.close();
})();
