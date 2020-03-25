var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (game) {

  var alive = game.findAll(x => x.isAlive());
  var anarchists = game.findAll(x => x.role_identifier === "anarchist" && x.isAlive());

  if (anarchists.length >= (alive.length / 2)) {

    var winners = anarchists.filter(x => x.canWin());

    game.setWins(winners);
    game.getMainChannel().send(auxils.getAssetAttachment("anarchist-wins.png"));
    game.primeWinLog("anarchist", "The Anarchist has bombed everyone out of existence in the revolution.");

    /* Return true to stop the game/checks
    depending on the configuration below. */

    return true;

  };

  return false;

};

module.exports.STOP_GAME = true;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = false;

module.exports.PRIORITY = 2;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = [];
module.exports.SURVIVING = ["anarchist"];

module.exports.PREVENT_CHECK_ON_WIN = ["mafia", "arsonist"];

module.exports.DESCRIPTION = "Kill everyone who can oppose you.";
