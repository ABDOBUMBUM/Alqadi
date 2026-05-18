const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // watch it
  const page = await browser.newPage();
  console.log("Navigating to fly-aden.com...");
  await page.goto('https://fly-aden.com/', { waitUntil: 'networkidle2' });
  
  try {
      console.log("Waiting for search widget...");
      // The widget might be an iframe or normal elements.
      // Usually there are inputs for origin, destination, date.
      // Let's just output the page content to see the form
      const content = await page.content();
      const fs = require('fs');
      fs.writeFileSync('flyaden-home.html', content);
      console.log("Saved flyaden-home.html");
      
  } catch (err) {
      console.log("Error:", err.message);
  }
  
  await browser.close();
})();
