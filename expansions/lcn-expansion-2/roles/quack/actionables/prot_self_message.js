module.exports = function (actionable, game, params) {

  var self = game.getPlayerByIdentifier(actionable.from);

  game.addMessage(self, ":exclamation: Your were attacked last night but you healed yourself!");

  // Do not destroy, ought there be more attacks
  return false;

};
