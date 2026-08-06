const fs = require('fs');
const raw = JSON.parse(fs.readFileSync('P:/niroflixx/niroflixx-backup.json', 'utf8'));
// The backup wraps everything in a "data" object
const d = raw.data || raw;

const esc = v => v === null ? 'NULL' : typeof v === 'boolean' ? v : "'" + String(v).replace(/'/g, "''") + "'";
const quoteId = id => '"' + id + '"';

// Mapping from backup key → actual table name
const tableMap = {
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
  messages: 'contact_messages',
  classes: 'classes',
  class_sessions: 'class_sessions',
  trainers: 'trainers',
  attendance: 'attendance'
};

let sql = 'SET session_replication_role = replica;\n\n';

for (const [backupKey, tableName] of Object.entries(tableMap)) {
  const rows = d[backupKey];
  if (!rows || rows.length === 0) continue;
  
  const cols = Object.keys(rows[0]).filter(c => c !== 'id');
  
  for (const r of rows) {
    sql += `INSERT INTO \"${tableName}\" (${quoteId('id')},${cols.map(c => quoteId(c)).join(',')}) VALUES ('${r.id}',${cols.map(c => esc(r[c])).join(',')}) ON CONFLICT (id) DO NOTHING;\n`;
  }
  sql += '\n';
}

sql += 'SET session_replication_role = DEFAULT;\n';

fs.writeFileSync('P:/niroflixx/niroflixx-import-mapped.sql', sql);
console.log('Mapped import file created: niroflixx-import-mapped.sql');