module.exports = function round (value, decimals=2, rounder=Math.round) {

  var multiple = Math.pow(10, decimals);

  return rounder(value * multiple) / multiple;

};
