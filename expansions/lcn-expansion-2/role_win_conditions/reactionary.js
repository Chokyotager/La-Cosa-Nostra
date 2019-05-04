var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (game) {

  var reactionaries = game.findAll(x => x.role_identifier === "reactionary" && x.isAlive() && x.misc.reactionary_kills_left < 1);

  if (reactionaries.length > 0) {

    var winners = reactionaries.filter(x => x.canWin());

    // Revolutionaries win
    game.setWins(winners);
    game.getMainChannel().send(auxils.getAssetAttachment("reactionary-wins.png"));
    game.primeWinLog("reactionary", "Half-smile on face, the Reactionary has taken complete control.");
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
