module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);

  if (game.arbiter_god_alive) {
    return null;
  };

  game.addMessage(from, ":exclamation: With the Arbiter God banished there is much more chaos, but you still wish to create a little more. Killing two individuals will satisfy yourself and your god.");

  return true;

};
