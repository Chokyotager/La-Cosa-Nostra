module.exports = function (actionable, game, params) {

  // Disable the player
  var disabled = game.getPlayerByIdentifier(actionable.to);

  if (!disabled.isAlive()) {
    return true;
  };

  // Send message
  game.addMessage(disabled, ":exclamation: You were disabled the night before. You may still submit an action, but it will not execute unless it is unstoppable.");

};
