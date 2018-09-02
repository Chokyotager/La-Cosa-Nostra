var auxils = require("../systems/auxils.js");

module.exports = function (game) {

  var winners = game.findAll(x => x.role.alignment === "town");

  game.setWins(winners);

  game.getLogChannel().send(auxils.getAssetAttachment("town-wins.png"));

  return true;

};

module.exports.STOP_GAME = true;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = true;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = ["mafia", "neutral-killing", "revolutionary"];
module.exports.SURVIVING = ["town"];

module.exports.DESCRIPTION = "Eliminate all threats to the Town.";
