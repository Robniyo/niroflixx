const fs = require('fs');
const data = JSON.parse(fs.readFileSync('niroflixx-backup.json', 'utf8')).data;

function escape(str) {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'boolean') return str ? 'TRUE' : 'FALSE';
  if (typeof str === 'number') return str;
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function generateInserts(table, records, idColumn = 'id') {
  if (!records || records.length === 0) return '';
  const columns = Object.keys(records[0]).filter(col => col !== idColumn);
  let sql = '';
  for (const row of records) {
    const vals = columns.map(col => escape(row[col]));
    const cols = [idColumn, ...columns].join(', ');
    const idVal = escape(row[idColumn]);
    sql += `INSERT INTO "${table}" (${cols}) VALUES (${idVal}, ${vals.join(', ')})\n  ON CONFLICT (${idColumn}) DO NOTHING;\n`;
  }
  return sql;
}

let output = '';
const tables = {
  users: { table: 'users', idCol: 'id' },
  courses: { table: 'courses', idCol: 'id' },
  opportunities: { table: 'opportunities', idCol: 'id' },
  services: { table: 'services', idCol: 'id' },
  resources: { table: 'resources', idCol: 'id' },
  news: { table: 'news', idCol: 'id' },
  candidates: { table: 'candidates', idCol: 'id' },
  applications: { table: 'applications', idCol: 'id' },
  testimonials: { table: 'testimonials', idCol: 'id' },
  partners: { table: 'partners', idCol: 'id' },
  settings: { table: 'settings', idCol: 'id' },
  subscribers: { table: 'newsletter_subscribers', idCol: 'id' },
  messages: { table: 'contact_messages', idCol: 'id' },
};

for (const [key, { table, idCol }] of Object.entries(tables)) {
  if (data[key]) {
    output += `-- Table: ${table}\n`;
    output += generateInserts(table, data[key], idCol);
    output += '\n';
  }
}

fs.writeFileSync('niroflixx-import.sql', output);
console.log('SQL file created: niroflixx-import.sql');