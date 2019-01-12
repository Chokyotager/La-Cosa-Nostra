module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);
  var to = game.getPlayerByIdentifier(actionable.to);

  // Set stats or do whatever
  to.setGameStat("basic-defense", 1, Math.max);

  return true;

};
