import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('./components/tools');
let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Specifically target metric grids that squish 3 or 4 cols.
  content = content.replace(/grid-cols-[234]\s+(?:sm|md|lg|xl):grid-cols-[34]\s/g, 'grid-cols-2 ');
  content = content.replace(/grid grid-cols-[34]\s/g, 'grid grid-cols-2 ');
  content = content.replace(/grid-cols-[2]\s+(?:sm|md|lg|xl):grid-cols-[34]"/g, 'grid-cols-2"');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log('Modified:', file);
  }
});
console.log('Total files modified:', modifiedCount);
