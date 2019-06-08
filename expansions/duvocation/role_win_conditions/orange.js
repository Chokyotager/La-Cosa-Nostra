var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (game) {

  // Have to manually set the win
  var players = game.getAlivePlayers();

  var apple_followers = players.filter(x => x.misc.juice === "apple").length;
  var orange_followers = players.filter(x => x.misc.juice === "orange").length;

  var delta = orange_followers - apple_followers;

  if (delta > 0) {

    var winners = game.findAll(x => x.role_identifier === "demigod_orange" && x.canWin());
    game.setWins(winners);

  };

  /* Return true to stop the game/checks
  depending on the configuration below. */

  return true;

};

module.exports.STOP_GAME = false;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = true;

module.exports.PRIORITY = 3;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = true;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = [];
module.exports.SURVIVING = [];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Gain more followers than the Demigod of Apple Juice.";
