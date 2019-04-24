var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (game) {

  var blood_wroughts = game.findAll(x => x.role_identifier === "blood_wrought" && !x.isAlive() && x.misc.blood_wrought_killed === true && !x.hasWon());

  if (blood_wroughts.length > 0) {

    var winners = blood_wroughts.filter(x => x.canWin());

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

module.exports.DESCRIPTION = "Get yourself killed at night at all costs.";
