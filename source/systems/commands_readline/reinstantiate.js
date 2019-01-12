var Timer = require("../game_templates/Timer.js");
var deleteTimer = require("../game_reset/deleteTimer.js");

module.exports = function (client, config) {

  deleteTimer(client, config);

  var timer = Timer.load(client, config);

  process.timer = timer;
  return timer;

};
