var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (game) {

  var jokers = game.findAll(x => x.role_identifier === "joker" && !x.isAlive() && x.misc.joker_lynched === true && !x.hasWon());

  if (jokers.length > 0) {

    var jokers = jokers.filter(x => x.canWin());

    game.setWins(jokers);
    return true;
  };

  return false;

};

module.exports.STOP_GAME = false;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = false;

module.exports.PRIORITY = 0;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = [];
module.exports.SURVIVING = [];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Get yourself lynched at all costs.";
