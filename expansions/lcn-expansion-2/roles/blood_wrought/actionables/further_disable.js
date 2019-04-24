module.exports = function (actionable, game, params) {

  // Disable the player
  var disabled = game.getPlayerByIdentifier(actionable.to);

  if (!disabled.isAlive()) {
    return true;
  };

  var has_disabled = game.actions.find(x => x.from === disabled.identifier && x.tags.includes("roleblockable"));

  disabled.setStatus("roleblocked", true);

  // Disable the player
  game.actions.delete(x => x.from === disabled.identifier && x.tags.includes("roleblockable"));

  if (has_disabled) {
    game.addMessage(disabled, ":exclamation: The disable from before has nulled your action.");
  };

};
