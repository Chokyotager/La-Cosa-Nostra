module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);

  if (game.arbiter_god_alive || from.misc.executions > 0) {
    return null;
  };

  game.addMessage(from, ":exclamation: Because the Arbiter God was banished, and you have shown your might publicly, the other members are intimidated, and your votes now count as double in the trials.");

  from.setPermanentStat("vote-magnitude", 2, "set");

  return true;

};
