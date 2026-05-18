const fs = require('fs');
const content = fs.readFileSync('videcom5.html', 'utf8');

const keywords = ['FlightCal', 'outboundroute', 'journey', 'Booking', 'Search', 'Reserve', 'رحلة', 'حجز'];
keywords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    const count = (content.match(regex) || []).length;
    console.log(`Keyword "${word}": found ${count} times`);
});

console.log("\n=== Showing some occurrences of 'booking' or 'FlightCal' context ===");
const idx = content.indexOf('FlightCal');
if (idx !== -1) {
    console.log("FlightCal context:", content.substring(idx - 100, idx + 200));
} else {
    console.log("No FlightCal found.");
}
