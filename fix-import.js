const fs = require('fs');
const d = JSON.parse(fs.readFileSync('P:/niroflixx/niroflixx-backup.json', 'utf8')).data;

const esc = v => v === null ? 'NULL' : typeof v === 'boolean' ? v : "'" + String(v).replace(/'/g, "''") + "'";
const quoteId = id => '"' + id + '"';

const tblMap = {
  users: 'users',
  courses: 'courses',
  opportunities: 'opportunities',
  services: 'services',
  resources: 'resources',
  news: 'news',
  candidates: 'candidates',
  applications: 'applications',
  testimonials: 'testimonials',
  partners: 'partners',
  settings: 'settings',
  subscribers: 'newsletter_subscribers',
  messages: 'contact_messages'
};

let sql = '';
for (const [k, t] of Object.entries(tblMap)) {
  if (d[k] && d[k].length) {
    const cols = Object.keys(d[k][0]).filter(c => c !== 'id');
    for (const r of d[k]) {
      sql += `INSERT INTO \"${t}\" (${quoteId('id')},${cols.map(c => quoteId(c)).join(',')})
              VALUES ('${r.id}',${cols.map(c => esc(r[c])).join(',')})
              ON CONFLICT (id) DO NOTHING;\n`;
    }
  }
}

fs.writeFileSync('P:/niroflixx/niroflixx-import-quoted.sql', sql);
console.log('Corrected import file created: niroflixx-import-quoted.sql');