const crypto = require('crypto');
function hash(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}
console.log('admin', hash('admin'));
console.log('admin@catzone.in', hash('admin@catzone.in'));
console.log('admin1234', hash('admin1234'));
console.log('catzone2026', hash('catzone2026'));
