var auxils = require("../systems/auxils.js");

module.exports = function (game) {

  var aliens = game.findAll(function (x) {

    if (x.role_identifier === "alien" && x.isAlive) {
      var probed = x.misc.alien_kidnappings;

      return game.findAll(y => y.isAlive() && !probed.includes(y.identifier) && y.identifier !== x.identifier).length < 1;
    } else {
      return false;
    };

  });

  if (aliens.length > 0) {

    // Revolutionaries win
    game.setWins(aliens);
    game.getMainChannel().send(auxils.getAssetAttachment("alien-wins.png"));
    game.primeWinLog("alien", "The extraterrestrial has gathered sufficient information to annihilate and control the planet.");
    return true;

  };

  return false;

};

module.exports.STOP_GAME = true;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = false;

module.exports.PRIORITY = 1;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = [];
module.exports.SURVIVING = ["alien"];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Everyone alive in the game has been probed and you are alive at that point in time.";
