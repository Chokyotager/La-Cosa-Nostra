var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  rs.prototypes.powerfulDefense(...arguments);
  var poisoned = rs.prototypes.removePoison(...arguments);

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Doctor-visit"});

  var self = game.getPlayerByIdentifier(actionable.from);

  if (poisoned) {
    game.addMessage(self, ":exclamation: You cured yourself of poison!");
  };

  // Add message
  game.addAction("doctor/prot_self_message", ["attacked"], {
    name: "Doc-prot-success-message",
    from: actionable.from,
    to: actionable.to,
    expiry: 1,
    priority: 10
  });

  self.misc.doc_self_heals--;

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
