const { execSync } = require('child_process');
const url = 'postgresql://niroflixx:fWATGESl3hXOJGq3RfA7dMIoURHTrszZ@dpg-d94j73faqgkc73duqln0-a.frankfurt-postgres.render.com/niroflixx';
const cmd = 'npx pg-dump ' + url + ' > P:\\niroflixx-backup.sql';
console.log('Running: ' + cmd);
execSync(cmd, { stdio: 'inherit' });
console.log('Backup saved!');