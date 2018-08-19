var Timer = require("../game_templates/Timer.js");

module.exports = function (client, config) {
  return Timer.load(client, config);
};
