var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Modular-inspection"});

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  var powers = target.attributes.filter(x => x.attribute.modular && x.attribute["modular-details"]["cluster"] === "power");

  if (rs.modular.hasModule(target, "Power Inspect Immunity", "trait")) {
    // Null powers
    powers = new Array();
  };

  powers.sort(x => x.attribute.name);

  if (powers.length > 0) {

    powers = powers.map(x => "**" + x.attribute.name + "**");
    var message = ":mag: Your target has the powers " + auxils.pettyFormat(powers) + ".";

  } else {

    var message = ":mag: Your target has no powers left.";

  };

  game.addMessage(from, message);

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
