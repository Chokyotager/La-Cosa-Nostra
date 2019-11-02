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
    game.addMessage(from, ":mag: You got the result __True__.");
  } else {
    game.addMessage(from, ":mag: Your got the result __False__..");
  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
