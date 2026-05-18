const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' }); 
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  
  // Let's log page console logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  const url = `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=ADE-CAI&journey=26-May-2026`;
  console.log("Navigating to:", url);
  
  try {
      const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      console.log("Navigated URL:", page.url());
      console.log("Status Code:", response.status());
      
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      const content = await page.content();
      console.log("Page title:", await page.title());
      console.log("HTML length:", content.length);
      
      const fs = require('fs');
      fs.writeFileSync('videcom5.html', content);
      await page.screenshot({ path: 'screenshot5.png', fullPage: true });
      console.log("Saved videcom5.html and screenshot5.png");
  } catch (err) {
      console.error("Navigation error:", err);
  }
  
  await browser.close();
})();
