module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);
  var to = game.getPlayerByIdentifier(actionable.to);

  game.addMessage(from, ":exclamation: Your target was attacked last night!");
  game.addMessage(to, ":exclamation: You were attacked last night but someone protected you!");

  // Do not destroy, ought there be more attacks
  return false;

};
