const fs = require('fs');
const d = JSON.parse(fs.readFileSync('P:/niroflixx/niroflixx-backup.json','utf8')).data;

const esc = v => v === null ? 'NULL' : typeof v === 'boolean' ? v : "'" + String(v).replace(/'/g, "''") + "'";
const quoteId = id => '"' + id + '"';

const tables = Object.keys(d).filter(k => Array.isArray(d[k]) && d[k].length > 0);

let sql = '';

// Disable foreign key checks
sql += 'SET session_replication_role = replica;\n\n';

for (const table of tables) {
  const rows = d[table];
  const cols = Object.keys(rows[0]).filter(c => c !== 'id');
  for (const r of rows) {
    sql += `INSERT INTO \"${table}\" (${quoteId('id')},${cols.map(c => quoteId(c)).join(',')}) VALUES ('${r.id}',${cols.map(c => esc(r[c])).join(',')}) ON CONFLICT (id) DO NOTHING;\n`;
  }
  sql += '\n';
}

// Re-enable foreign key checks
sql += 'SET session_replication_role = DEFAULT;\n';

fs.writeFileSync('P:/niroflixx/niroflixx-import-final.sql', sql);
console.log('Final import file created: niroflixx-import-final.sql (tables: ' + tables.length + ')');