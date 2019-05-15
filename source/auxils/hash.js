var crypto = require('crypto');

module.exports = function (string, hash="md5", encoding="hex") {

  return crypto.createHash(hash).update(string).digest(encoding);

};
