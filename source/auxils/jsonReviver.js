var jsonInfinityReviver = require("./jsonInfinityReviver.js");
var jsonDateTimeReviver = require("./jsonDateTimeReviver.js");

module.exports = function (key, value) {

  value = jsonInfinityReviver(key, value);
  return jsonDateTimeReviver(key, value);

};
