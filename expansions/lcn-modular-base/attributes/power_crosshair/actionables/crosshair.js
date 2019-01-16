var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var crosshair = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  // Seen as visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Modular-visit"});

  game.addAction("a/power_crosshair/attack_prime", ["postcycle"], {
    name: "Modular-attack",
    expiry: 2,
    from: actionable.from,
    to: actionable.to,
    crosshair_target: actionable.to
  });

  game.addMessage(crosshair, ":exclamation: Your current crosshair target has been set to **" + target.getDisplayName() + "**. Should you die at night, you will deal them an unstoppable attack.");

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
