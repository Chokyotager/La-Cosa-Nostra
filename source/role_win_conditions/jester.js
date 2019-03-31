var auxils = require("../systems/auxils.js");

module.exports = function (game) {

  var jesters = game.findAll(x => x.role_identifier === "jester" && !x.isAlive() && x.misc.jester_lynched === true && !x.hasWon());

  if (jesters.length > 0) {

    var winners = jesters.filter(x => x.canWin());

    game.setWins(winners);
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
