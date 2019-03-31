module.exports = function (game) {

  // Have to manually set the win
  var winners = game.findAll(x => x.role_identifier === "survivor" && x.isAlive() && x.canWin());

  game.setWins(winners);

  /* Return true to stop the game/checks
  depending on the configuration below. */

  return true;

};

module.exports.STOP_GAME = false;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = false;

module.exports.PRIORITY = 4;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = true;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = [];
module.exports.SURVIVING = ["survivor"];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Survive to the end of the game at all costs.";
