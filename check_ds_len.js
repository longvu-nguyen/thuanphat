const fs = require('fs');
const ds = fs.readFileSync('E:/congty/Code/thuanphat/js/data-store.js', 'utf8');
const match = ds.match(/const DEFAULT_PRODUCTS = (\[[\s\S]*?\]);/);
if (match) {
  const prods = JSON.parse(match[1]);
  console.log('DEFAULT_PRODUCTS length in data-store.js:', prods.length);
} else {
  console.log('Could not parse DEFAULT_PRODUCTS');
}
