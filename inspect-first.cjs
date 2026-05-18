const fs = require('fs');
const content = fs.readFileSync('videcom5.html', 'utf8');
console.log("File Length:", content.length);
console.log("First 1000 chars:");
console.log(content.substring(0, 1000));
