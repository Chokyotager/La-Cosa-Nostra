var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (game) {

  var copy_machine = game.findAll(x => x.role_identifier === "modular_copy_machine" && x.modular_log.filter(x => x !== "power_power_copy").length >= 3 && !x.hasWon());

  if (copy_machine.length > 0) {

    var winners = copy_machine.filter(x => x.canWin());

    // Revolutionaries win
    game.setWins(winners);
    return true;

  };

  return false;

};

module.exports.STOP_GAME = false;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = false;

module.exports.PRIORITY = 1;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = [];
module.exports.SURVIVING = [];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Copy and execute 3 non-copy actions.";
