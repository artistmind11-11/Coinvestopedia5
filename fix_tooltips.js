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

const files = walk('./components');
let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  const pieces = content.split('<Tooltip');
  if (pieces.length > 1) {
      for (let i = 1; i < pieces.length; i++) {
          let insert = '';
          if (!pieces[i].includes('itemStyle={{')) {
              insert += ' itemStyle={{ color: \'#e4e4e7\' }}';
          }
          if (!pieces[i].includes('labelStyle={{')) {
              insert += ' labelStyle={{ color: \'#a1a1aa\' }}';
          }
          if (insert !== '') {
             pieces[i] = insert + pieces[i];
          }
      }
      content = pieces.join('<Tooltip');
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log('Modified:', file);
  }
});
console.log('Total files modified:', modifiedCount);
