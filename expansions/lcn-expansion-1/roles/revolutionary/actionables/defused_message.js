module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);
  var to = game.getPlayerByIdentifier(actionable.to);

  game.addMessage(from, ":exclamation: The bomb tagged on your target has been deactivated.");
  game.addMessage(to, ":exclamation: A bomb that was tagged on you last night has now been inactivated!");

  // Do not destroy, ought there be more attacks
  return false;

};
