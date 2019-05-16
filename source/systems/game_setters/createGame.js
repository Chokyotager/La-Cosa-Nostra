var expansions = require("../expansions.js");

var Game = require("../game_templates/Game.js");
var Timer = require("../game_templates/Timer.js");

module.exports = async function (client, config, roles, mafia_channel) {

  var game = new Game(client, config).init(roles);

  // IMPORTANT!
  if (mafia_channel) {
    game.setChannel("mafia", mafia_channel);
  };

  for (var i = expansions.length - 1; i >= 0; i--) {

    var game_prime = expansions[i].scripts.game_prime;

    if (!game_prime) {
      continue;
    };

    await game_prime(this);

  };

  var timer = new Timer().init(game);
  return [game, timer];

};
