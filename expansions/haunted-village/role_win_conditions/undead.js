var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (game) {

  var players = game.players;

  // Reach parity with surviving players
  // Eliminated other roles

  // Return true to determine win

  var alive = game.findAll(x => x.isAlive());
  var undead = game.findAll(x => x.role.alignment === "undead" && x.isAlive());

  if (undead.length >= (alive.length / 2)) {
    // Parity reached

    var winners = game.findAll(x => x.role.alignment === "undead" && x.canWin());

    game.setWins(winners);
    game.getMainChannel().send(auxils.getAssetAttachment("undead-wins.png"));
    game.primeWinLog("undead", "The Undead now controls the village.");

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
module.exports.ELIMINATED = ["neutral-killing", "revolutionary", "death", "pestilence", "cult"];
module.exports.SURVIVING = ["undead"];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Reach parity with the Village.";
