var auxils = require("../systems/auxils.js");

module.exports = function (game) {

  var jesters = game.findAll(x => x.role_identifier === "jester" && !x.isAlive() && x.misc.jester_lynched === true && !x.hasWon());

  if (jesters.length > 0) {
    game.setWins(jesters);
    return true;
  };

  return false;

};

module.exports.STOP_GAME = false;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = [];
module.exports.SURVIVING = [];

module.exports.DESCRIPTION = "Get yourself lynched at all costs.";
