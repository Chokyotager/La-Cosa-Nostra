var Game = require("../game_templates/Game.js");
var Timer = require("../game_templates/Timer.js");

module.exports = function (client, config, roles, mafia_channel) {
  var game = new Game(client, config).init(roles);

  // IMPORTANT!
  if (mafia_channel) {
    game.setChannel("mafia", mafia_channel);
  };

  var timer = new Timer().init(game);
  return [game, timer];
};
