module.exports = function (actionable, game, params) {

  var from = game.getPlayerByAlphabet(actionable.from);
  var to = game.getPlayerByAlphabet(actionable.to);

  // Set stats or do whatever
  to.setGameStat("basic-defense", 2, Math.max);

};
