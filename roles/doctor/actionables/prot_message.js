module.exports = function (actionable, game, params) {

  var from = game.getPlayerById(actionable.from);
  var to = game.getPlayerById(actionable.to);

  game.addMessage(from, ":exclamation: Your target was attacked last night!");
  game.addMessage(to, ":exclamation: You were attacked but someone healed you!");

  // Do not destroy, ought there be more attacks
  return false;

};
