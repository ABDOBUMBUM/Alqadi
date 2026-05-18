const fs = require('fs');
const content = fs.readFileSync('videcom5.html', 'utf8');

console.log("=== Searching for videcom links ===");
const videcomMatches = content.match(/https?:\/\/[^\s"'`<>]+videcom[^\s"'`<>]+/gi);
if (videcomMatches) {
    console.log("Found Videcom links:", [...new Set(videcomMatches)]);
} else {
    console.log("No Videcom links found.");
}

console.log("\n=== Searching for iframe tags ===");
const iframeMatches = content.match(/<iframe[^>]*>/gi);
if (iframeMatches) {
    console.log("Found iframe tags:", iframeMatches);
} else {
    console.log("No iframe tags found.");
}

console.log("\n=== Searching for booking inputs ===");
const inputMatches = content.match(/<input[^>]*>/gi);
if (inputMatches) {
    console.log(`Found ${inputMatches.length} inputs. Showing some:`);
    inputMatches.slice(0, 15).forEach((tag, idx) => console.log(`  ${idx}: ${tag}`));
}

console.log("\n=== Searching for select dropdowns ===");
const selectMatches = content.match(/<select[^>]*>([\s\S]*?)<\/select>/gi);
if (selectMatches) {
    console.log(`Found ${selectMatches.length} selects. Showing details:`);
    selectMatches.forEach((tag, idx) => {
        console.log(`  Select #${idx}: ${tag.substring(0, 200)}...`);
    });
}
