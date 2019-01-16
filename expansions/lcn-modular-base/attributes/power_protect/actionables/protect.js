var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {
  rs.prototypes.powerfulDefense(...arguments);
  var poisoned = rs.prototypes.removePoison(...arguments);

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Modular-visit"});

  var from = game.getPlayerByIdentifier(actionable.from);
  var to = game.getPlayerByIdentifier(actionable.to);

  if (poisoned) {
    game.addMessage(from, ":exclamation: You cured your target of poison!");

    game.addMessage(to, ":exclamation: You were cured of poison!");
  };

  // Add message
  game.addAction("a/power_protect/prot_message", ["attacked"], {
    name: "Modular-prot-success-message",
    from: actionable.from,
    to: actionable.to,
    expiry: 1,
    priority: 10
  });

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
