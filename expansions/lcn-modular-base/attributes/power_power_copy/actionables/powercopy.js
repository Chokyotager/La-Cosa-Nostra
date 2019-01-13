var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  // Run decrement first for power manipulation
  rs.modular.attributeDecrement(...arguments);

  var max_delta = 2;

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Modular-visit"});

  var scan_power = x => x.attribute.modular && x.attribute["modular-details"]["cluster"] === "power";

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  if (rs.modular.hasModule(target, "Power Manipulation Immunity", "trait")) {
    // Null powers
    game.addMessage(from, ":exclamation: You were unable to copy any powers.");
    return null;
  };

  var target_powers = target.attributes.filter(scan_power);

  // Randomise
  target_powers = auxils.cryptographicShuffle(target_powers);
  var copied = new Array();

  for (var i = 0; i < Math.min(target_powers.length, max_delta); i++) {
    var power = target_powers[i];

    if (from.hasAttribute(power.identifier)) {
      from.attributes.find(x => x.attribute.name === power.attribute.name).tags.uses++;
    } else {
      from.addAttribute(power.identifier, Infinity, {uses: 1});
    };

    copied.push(power);

  };

  copied = copied.map(x => "`" + x.attribute.name + "`");

  if (copied.length > 0) {
    game.addMessage(from, ":exclamation: You managed to copy the power" + auxils.vocab("s", copied.length) + " " + auxils.pettyFormat(copied) + ".");
  } else {
    game.addMessage(from, ":exclamation: You were unable to copy any powers.");
  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
