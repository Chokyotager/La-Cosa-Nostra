var auxils = require("../systems/auxils.js");

module.exports = function (game) {

  game.getLogChannel().send("**Arsonist wins.**");

  // Have to manually set the win
  var winners = game.findAll(x => x.role_identifier === "arsonist" && x.isAlive());

  game.setWins(winners);

  game.getMainChannel().send(auxils.getAssetAttachment("arsonist-wins.png"));
  game.primeWinLog("arsonist", "Wearing a half-smile as an expression, the Arsonist has burned the Town into oblivion.");

  /* Return true to stop the game/checks
  depending on the configuration below. */

  return true;

};

module.exports.STOP_GAME = true;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = false;

module.exports.PRIORITY = 0;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = ["town", "mafia", "serial_killer", "revolutionary"];
module.exports.SURVIVING = ["arsonist"];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Kill everyone who can oppose you.";
