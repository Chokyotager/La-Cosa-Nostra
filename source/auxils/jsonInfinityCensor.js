// To convert Infinity to a string

module.exports = function (key, value) {
  return value === Infinity ? "__Infinity" : value;
};
