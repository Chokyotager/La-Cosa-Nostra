var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  rs.prototypes.increaseImmunity(...arguments);
  var poisoned = rs.prototypes.removePoison(...arguments);

  var self = game.getPlayerByIdentifier(actionable.from);

  if (poisoned) {
    game.addMessage(self, ":exclamation: You cured yourself of poison!");
  };

  if (self.status.roleblocked) {
    return null;
  };

  // Add message
  game.addAction("doctor/prot_message", ["attacked"], {
    name: "Doc-prot-success-message",
    from: actionable.from,
    to: actionable.to,
    expiry: 1
  });

  self.misc.doc_self_heals--;

};