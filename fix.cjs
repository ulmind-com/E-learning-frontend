const fs = require('fs');
const path = require('path');
function walk(d) {
  let list = fs.readdirSync(d);
  list.forEach(file => {
    let f = path.join(d, file);
    let stat = fs.statSync(f);
    if (stat && stat.isDirectory()) {
      walk(f);
    } else {
      if (f.endsWith('.jsx')) {
        let c = fs.readFileSync(f, 'utf8');
        let nc = c.replace(/src=\{course\.thumbnail\}/g, "src={course.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${course.thumbnail}` : course.thumbnail}");
        if (c !== nc) {
          fs.writeFileSync(f, nc, 'utf8');
          console.log('Fixed thumbnail', f);
        }
      }
    }
  });
}
walk('src/pages');
