module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);
  var to = game.getPlayerByIdentifier(actionable.to);

  var removed = game.actions.delete(x => x.tags.includes("poison") && x.to === actionable.to);

  if (removed.length > 0) {
    return true;
  } else {
    return false;
  };

};
