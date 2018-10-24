var auxils = require("../systems/auxils.js");

module.exports = function (game) {

  var alive = game.findAll(x => x.isAlive());
  var pestilence = game.findAll(x => (x.role_identifier === "pestilence" || x.role_identifier === "plaguebearer") && x.isAlive());

  if (pestilence.length >= (alive.length / 2)) {

    game.setWins(pestilence);
    game.getMainChannel().send(auxils.getAssetAttachment("pestilence-wins.png"));
    game.primeWinLog("pestilence", "The Horseman of the Apocalypse reigns with fear.");

    /* Return true to stop the game/checks
    depending on the configuration below. */

    return true;

  };

  return false;

};

module.exports.STOP_GAME = true;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = false;

module.exports.PRIORITY = 0;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = ["serial_killer", "revolutionary"];
module.exports.SURVIVING = [x => (x.role_identifier === "plaguebearer" || x.role_identifier === "pestilence")];

module.exports.PREVENT_CHECK_ON_WIN = ["mafia"];

module.exports.DESCRIPTION = "Kill everyone who can oppose you.";
