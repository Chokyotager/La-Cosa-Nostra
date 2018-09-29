var auxils = require("../systems/auxils.js");

module.exports = function (game) {

  var revolutionaries = game.findAll(x => x.role_identifier === "revolutionary" && x.isAlive() && x.misc.revolutionary_kills_left < 1);

  if (revolutionaries.length > 0) {

    // Revolutionaries win
    game.setWins(revolutionaries);
    game.getMainChannel().send(auxils.getAssetAttachment("revolutionary-wins.png"));
    game.primeWinLog("revolutionary", "Half-smile on face, the Revolutionary has taken complete control.");
    return true;

  };

  return false;

};

module.exports.STOP_GAME = true;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = false;

module.exports.PRIORITY = 2;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = [];
module.exports.SURVIVING = [];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Kill three people using the Revolutionary-bomb trick.";
