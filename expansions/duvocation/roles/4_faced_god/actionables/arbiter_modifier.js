module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);

  if (game.arbiter_god_alive) {
    return null;
  };

  game.addMessage(from, ":exclamation: Because the Arbiter God was banished, two random blessings in total have been given to random followers of the 3-faced god.");

  return true;

};
