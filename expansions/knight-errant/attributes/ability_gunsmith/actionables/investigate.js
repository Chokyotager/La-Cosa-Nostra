var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Gunsmith-investigation"});

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  // Check roles
  var immunity = target.getStat("detection-immunity", Math.max);

  // Not immune
  if (immunity >= 1 || rs.knight_errant.investigationImmunity(target)) {

    game.addMessage(from, ":mag: You got the result of __False__.");

  } else {

    switch (true) {

      case (target.role_identifier === "cop"):
        game.addMessage(from, ":mag: You got the result of __True__.");
        break;

      case (target.role_identifier === "gunsmith"):
        game.addMessage(from, ":mag: You got the result of __True__.");
        break;

      case (target.role_identifier === "jailkeeper"):
        game.addMessage(from, ":mag: You got the result of __True__.");
        break;

      case (target.role_identifier === "serial_killer"):
        game.addMessage(from, ":mag: You got the result of __True__.");
        break;

      case (target.role.alignment === "mafia"):
        game.addMessage(from, ":mag: You got the result of __True__.");
        break;

      default:
        game.addMessage(from, ":mag: You got the result of __False__.");
        break;

    };

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
