var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (game) {

  var players = game.players;

  // Reach parity with surviving players
  // Eliminated other roles

  // Return true to determine win

  var alive = game.findAll(x => x.isAlive());
  var mafia = game.findAll(x => x.role.alignment === "mafia" && x.isAlive());

  if (mafia.length >= (alive.length / 2)) {
    // Parity reached

    var winners = game.findAll(x => x.role.alignment === "mafia" && x.canWin());

    game.setWins(winners);
    game.getMainChannel().send(auxils.getAssetAttachment("mafia-wins.png"));
    game.primeWinLog("mafia", "The Mafia has taken control in the revolution.");

    return true;
  };

  return false;

};

module.exports.STOP_GAME = true;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = true;

module.exports.PRIORITY = 3;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = ["neutral-killing", "revolutionary", "death", "pestilence", "cult", "arsonist", "anarchist"];
module.exports.SURVIVING = ["mafia"];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Destroy anybody who would not submit to the Mafia.";
