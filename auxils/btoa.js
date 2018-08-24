// Base64 decode

module.exports = function (string) {
  return Buffer.from(string, "base64").toString("utf8");
};
