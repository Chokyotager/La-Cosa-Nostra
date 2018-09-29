var auxils = require("../systems/auxils.js");

module.exports = function (game) {

  var jack_of_all_trades = game.findAll(x => x.role_identifier === "jack_of_all_trades" && x.misc.joat_actions_left < 1 && !x.hasWon());

  if (jack_of_all_trades.length > 0) {

    // Revolutionaries win
    game.setWins(jack_of_all_trades);
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

module.exports.DESCRIPTION = "Fulfil the conditions of four random night actions.";
