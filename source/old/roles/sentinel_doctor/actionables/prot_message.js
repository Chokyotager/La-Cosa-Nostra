module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);
  var to = game.getPlayerByIdentifier(actionable.to);

  if (from.identifier !== to.identifier) {

    game.addMessage(from, ":exclamation: Your target was attacked last night!");
    game.addMessage(to, ":exclamation: You were attacked last night but someone healed you!");

  } else {

    game.addMessage(from, ":exclamation: You were attacked last night but you healed yourself.");

  };

  // Do not destroy, ought there be more attacks
  return false;

};
