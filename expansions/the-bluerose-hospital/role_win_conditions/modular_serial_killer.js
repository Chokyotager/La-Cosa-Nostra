var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (game) {

  var serial_killer = game.findAll(x => x.role_identifier === "modular_serial_killer" && x.modular_success_log.filter(x => x === "power_rid_kill").length >= 2 && !x.hasWon());

  if (serial_killer.length > 0) {

    // Revolutionaries win
    game.setWins(serial_killer);
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

module.exports.DESCRIPTION = "RID Kill 2 people.";
