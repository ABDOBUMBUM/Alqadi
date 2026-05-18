const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('videcom5.html', 'utf8');
const $ = cheerio.load(html);

console.log("=== Form elements ===");
$('form').each((i, el) => {
    console.log(`Form #${i}:`);
    console.log("  action:", $(el).attr('action'));
    console.log("  method:", $(el).attr('method'));
    console.log("  id:", $(el).attr('id'));
    console.log("  class:", $(el).attr('class'));
    
    // Inputs inside this form
    $(el).find('input, select, button').each((j, input) => {
        console.log(`    Input: name="${$(input).attr('name') || ''}" type="${$(input).attr('type') || ''}" value="${$(input).attr('value') || ''}" id="${$(input).attr('id') || ''}"`);
    });
});

console.log("\n=== Scripts with booking search logic ===");
$('script').each((i, el) => {
    const src = $(el).attr('src');
    const text = $(el).text();
    if (src) {
        if (src.includes('booking') || src.includes('search') || src.includes('flight')) {
            console.log("Script src:", src);
        }
    } else {
        if (text.includes('outboundroute') || text.includes('FlightCal') || text.includes('journey') || text.includes('videcom')) {
            console.log("Inline Script found matching search terms (first 500 chars):");
            console.log(text.substring(0, 500));
        }
    }
});
