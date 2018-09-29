module.exports = function (game) {

  game.getLogChannel().send("**Serial Killer wins.**");

  // Have to manually set the win
  var winners = game.findAll(x => x.role_identifier === "serial_killer" && x.isAlive());

  game.setWins(winners);

  /* Return true to stop the game/checks
  depending on the configuration below. */

  return true;

};

module.exports.STOP_GAME = true;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = false;

module.exports.PRIORITY = 2;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = ["town", "mafia"];
module.exports.SURVIVING = ["serial_killer"];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Kill everyone who can oppose you.";
