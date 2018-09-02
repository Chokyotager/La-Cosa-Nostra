var auxils = require("../systems/auxils.js");

module.exports = function (game) {

  game.getLogChannel().send("**Arsonist wins.**");

  // Have to manually set the win
  var winners = game.findAll(x => x.role_identifier === "arsonist" && x.isAlive());

  game.setWins(winners);

  game.getMainChannel().send(auxils.getAssetAttachment("arsonist-wins.png"));
  game.postWinLog("arsonist", "Wearing a half-smile as an expression, the Arsonist has burned the Town into oblivion.");

  /* Return true to stop the game/checks
  depending on the configuration below. */

  return true;

};

module.exports.STOP_GAME = true;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = ["town", "mafia", "serial_killer", "revolutionary"];
module.exports.SURVIVING = ["arsonist"];

module.exports.DESCRIPTION = "Kill everyone who can oppose you.";
