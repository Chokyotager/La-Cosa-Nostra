module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);

  if (game.arbiter_god_alive) {
    return null;
  };

  game.addMessage(from, ":exclamation: Because the days are no longer organized without the Arbiter God, you now have time to make one charm every day onwards.");

  return true;

};
