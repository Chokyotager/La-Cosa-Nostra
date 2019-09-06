module.exports = function (actionable, game, params) {

  var quaestor = game.getPlayerByIdentifier(actionable.from);

  if (!actionable.cloak) {
    quaestor.clearDisplayRole();
    return true;
  };

  quaestor.setDisplayRole(actionable.cloak.name);
  return true;

};
