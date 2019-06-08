var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (game) {

  var focs = game.findAll(x => x.role_identifier === "follower_of_the_chaos_god" && x.misc.kills_to_win < 1 && !x.hasWon());

  if (focs.length > 0) {

    var winners = focs.filter(x => x.canWin());

    // Revolutionaries win
    game.setWins(winners);
    return true;

  };

  return false;

};

module.exports.STOP_GAME = false;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = true;

module.exports.PRIORITY = 3;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = [];
module.exports.SURVIVING = [];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Lynch the Arbiter god, and kill two other individuals.";
