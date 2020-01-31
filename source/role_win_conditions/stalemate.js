var auxils = require("../systems/auxils.js");

module.exports = function (game) {

  var alive = game.findAll(x => x.isAlive());

  if (alive.length < 1) {

    game.primeWinLog("stalemate", "Nobody wins.");
    return true;
    
  };

  return false;

};

module.exports.STOP_GAME = true;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = true;

module.exports.PRIORITY = 10;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = [];
module.exports.SURVIVING = [];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "A stalemate condition where nobody wins.";
