const fs = require('fs');
const d = JSON.parse(fs.readFileSync('P:/niroflixx/niroflixx-backup.json', 'utf8')).data;

const esc = v => v === null ? 'NULL' : typeof v === 'boolean' ? v : "'" + String(v).replace(/'/g, "''") + "'";
const quoteId = id => '"' + id + '"';

// dependency order: parent tables first
const tableOrder = [
  'categories', 'tags', 'users', 'profiles', 'sessions', 'candidates',
  'education', 'experiences', 'candidate_skills', 'candidate_certificates',
  'candidate_documents', 'courses', 'lessons', 'enrollments', 'reviews',
  'opportunities', 'applications', 'resources', 'downloads', 'bookmarks',
  'news', 'services', 'service_requests', 'notifications', 'messages',
  'media', 'advertisements', 'support_tickets', 'settings', 'audit_logs',
  'announcements', 'newsletter_subscribers', 'contact_messages',
  'classes', 'class_sessions', 'trainers', 'attendance', 'testimonials', 'partners'
];

let sql = '';
for (const table of tableOrder) {
  const data = d[table] || [];
  if (data.length === 0) continue;
  const cols = Object.keys(data[0]).filter(c => c !== 'id');
  for (const r of data) {
    sql += `INSERT INTO \"${table}\" (${quoteId('id')},${cols.map(c => quoteId(c)).join(',')}) VALUES ('${r.id}',${cols.map(c => esc(r[c])).join(',')}) ON CONFLICT (id) DO NOTHING;\n`;
  }
}

fs.writeFileSync('P:/niroflixx/niroflixx-import-ordered.sql', sql);
console.log('Ordered import file created: niroflixx-import-ordered.sql');