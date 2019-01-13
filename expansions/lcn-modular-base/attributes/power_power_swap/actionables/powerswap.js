var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Modular-visit"});

  var scan_power = x => x.attribute.modular && x.attribute["modular-details"]["cluster"] === "power";

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  if (rs.modular.hasModule(target, "Power Manipulation Immunity", "trait")) {
    // Null powers
    game.addMessage(from, ":exclamation: You were unable to swap powers with your target.");
    game.addMessage(target, ":exclamation: Someone tried to swap powers with you but you were immune!");
    return null;
  };

  // Run decrement first for power manipulation
  rs.modular.attributeDecrement(...arguments);

  var from_powers = from.attributes.filter(scan_power);
  var target_powers = target.attributes.filter(scan_power);

  from.deleteAttributes(scan_power);
  target.deleteAttributes(scan_power);

  from.attributes = from.attributes.concat(target_powers);
  target.attributes = target.attributes.concat(from_powers);

  game.addMessage(from, ":exclamation: Your powers have been swapped.");
  game.addMessage(target, ":exclamation: Your powers have been swapped.");

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
