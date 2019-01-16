var auxils = require("../systems/auxils.js");

module.exports = function (game) {

  var players = game.players;

  // Reach parity with surviving players
  // Eliminated other roles

  // Return true to determine win

  var alive = game.findAll(x => x.isAlive());
  var cult = game.findAll(x => x.role.alignment === "cult" && x.isAlive());

  if (cult.length >= (alive.length / 2)) {
    // Parity reached

    var winners = game.findAll(x => x.role.alignment === "cult" && x.isAlive());

    game.setWins(winners);
    game.getMainChannel().send(auxils.getAssetAttachment("cult-wins.png"));
    game.primeWinLog("cult", "Through brainwashing and murder, the Cult has gained complete control.");

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
module.exports.ELIMINATED = ["neutral-killing", "revolutionary", "death", "pestilence", "mafia"];
module.exports.SURVIVING = ["cult"];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Survive and reach parity as the cult.";
