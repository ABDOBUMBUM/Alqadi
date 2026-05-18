const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('videcom.html', 'utf8');
const $ = cheerio.load(html);

console.log("=== Page Title ===");
console.log($('title').text().trim());

console.log("\n=== Checking for errors or messages ===");
const errorMsg = $('.errorMessage, .ErrorText, .warning').text().trim();
if (errorMsg) {
    console.log("Found Message/Error:", errorMsg);
} else {
    console.log("No explicit error message container found.");
}

console.log("\n=== Checking flight tables / grid ===");
// Videcom usually has a calendar grid or table of flights
$('table, div').each((i, el) => {
    const className = $(el).attr('class') || '';
    const id = $(el).attr('id') || '';
    if (className.toLowerCase().includes('flight') || id.toLowerCase().includes('flight') || className.toLowerCase().includes('matrix') || className.toLowerCase().includes('calendar') || className.toLowerCase().includes('cal')) {
        console.log(`Element: <${el.name} class="${className}" id="${id}">`);
        const text = $(el).text().trim().replace(/\s+/g, ' ');
        if (text.length > 0) {
            console.log("Text snippet:", text.substring(0, 300));
        }
    }
});

console.log("\n=== Looking for dates and prices ===");
// Let's look for anything with pricing patterns (currency symbols or numbers followed by USD, $, or YER, SAR)
$('span, td, div, a').each((i, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text.includes('$') || text.includes('USD') || text.includes('SAR') || text.includes('Riyal') || text.includes('ريال')) {
        if (text.length < 100) {
            console.log(`Possible price container [${el.name} class="${$(el).attr('class') || ''}"]:`, text);
        }
    }
    
    if (text.includes('May') || text.includes('2026') || text.includes('26')) {
        if (text.length < 150 && (text.includes('Flight') || text.includes('رحلة') || text.includes('Price') || text.includes('USD') || text.includes('$'))) {
            console.log(`Possible flight info [${el.name}]:`, text);
        }
    }
});
