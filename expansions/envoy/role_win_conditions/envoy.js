var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (game) {

  var alive = game.findAll(x => x.isAlive());
  var envoy = game.findAll(x => x.role.alignment === "envoy" && x.isAlive());

  if (envoy.length >= (alive.length / 2)) {
    // Parity reached

    var winners = game.findAll(x => x.role.alignment === "envoy" && x.canWin());

    game.setWins(winners);
    game.getMainChannel().send(auxils.getAssetAttachment("envoys-win.png"));
    game.primeWinLog("envoy", "The Envoys have reached parity and eliminated all secondary threats.");

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
module.exports.ELIMINATED = ["neutral-killing", "revolutionary", "pestilence", "cult"];
module.exports.SURVIVING = ["envoy"];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Reach parity with the Town and eliminate all secondary threats.";
