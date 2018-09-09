module.exports = function (game) {

  var revolutionaries = game.findAll(x => x.role_identifier === "revolutionary" && x.isAlive() && x.misc.revolutionary_kills_left < 1);

  if (revolutionaries.length > 0) {

    // Revolutionaries win
    game.setWins(revolutionaries);
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
module.exports.SURVIVING = [];

module.exports.DESCRIPTION = "Kill three people using the Revolutionary-bomb trick.";
