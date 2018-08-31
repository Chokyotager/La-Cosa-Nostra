module.exports = function (game) {

  var players = game.players;

  // Reach parity with surviving players
  // Eliminated other roles

  // Return true to determine win

  var alive = game.findAll(x => x.isAlive());
  var mafia = game.findAll(x => x.role.alignment === "mafia" && x.isAlive());

  if (mafia.length >= (alive.length / 2)) {
    // Parity reached
    game.setWins(mafia);
    game.getLogChannel().send("**Mafia wins.**");

    return true;
  };

  return false;

};

module.exports.STOP_GAME = true;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = true;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = ["neutral-killing", "revolutionary"];
module.exports.SURVIVING = ["mafia"];
