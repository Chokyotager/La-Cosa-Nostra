var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);
  var alien = game.getPlayerByIdentifier(actionable.from);

  // Considered as visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Alien-visit"});

  rs.prototypes.unstoppableKidnap.reason = "abducted";
  rs.prototypes.unstoppableKidnap(...arguments);

  target.setStatus("kidnapped", true);

  if (!alien.misc.alien_kidnappings.includes(actionable.to)) {
    alien.misc.alien_kidnappings.push(actionable.to);
  };

  game.addMessage(target, ":exclamation: You were abducted last night!");

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
