var auxils = require("../systems/auxils.js");

module.exports = function (game) {

  var alive = game.findAll(x => x.isAlive());
  var serial_killers = game.findAll(x => x.role_identifier === "serial_killer" && x.isAlive());

  if (serial_killers.length >= (alive.length / 2)) {

    game.setWins(serial_killers);
    game.getMainChannel().send(auxils.getAssetAttachment("serial-killer-wins.png"));
    game.primeWinLog("serial killer", "The Serial Killer has destroyed everyone who could oppose them.");

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
module.exports.SURVIVING = ["serial_killer"];

module.exports.PREVENT_CHECK_ON_WIN = ["mafia"];

module.exports.DESCRIPTION = "Kill everyone who can oppose you.";
