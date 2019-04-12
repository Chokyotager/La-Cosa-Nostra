var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Neapolitan-check"});

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  if (target.role_identifier === "vanilla_townie") {
    game.addMessage(from, ":mag: Your target is a __Town Vanilla__.");
  } else {
    game.addMessage(from, ":mag: Your target is not a __Town Vanilla__.");
  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
