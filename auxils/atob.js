// Base64 encode

module.exports = function (string) {
  return Buffer.from(string).toString("base64");
};
