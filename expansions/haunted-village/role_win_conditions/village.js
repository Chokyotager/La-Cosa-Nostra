var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (game) {

  var winners = game.findAll(x => x.role.alignment === "village" && x.canWin());

  game.setWins(winners);

  game.getMainChannel().send(auxils.getAssetAttachment("village-wins.png"));
  game.primeWinLog("village", "All threats to the Village have been wiped out.");

  return true;

};

module.exports.STOP_GAME = true;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = true;

module.exports.PRIORITY = 3;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = ["mafia", "undead", "neutral-killing", "revolutionary", "reactionary", "alien", "plaguebearer", "pestilence", "epi_plaguebearer", "epi_pestilence", "cult", "serial_killer"];
module.exports.SURVIVING = ["town"];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Eliminate all threats to the Village.";
