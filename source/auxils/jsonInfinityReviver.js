// To revive

module.exports = function (key, value) {
  return value === "__Infinity" ? Infinity : value;
};
