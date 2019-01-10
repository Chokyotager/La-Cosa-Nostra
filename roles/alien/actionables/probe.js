var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);
  var alien = game.getPlayerByIdentifier(actionable.from);
  
  rs.prototypes.unstoppableKidnap.reason = "abducted";
  var outcome = rs.prototypes.unstoppableKidnap(...arguments);

  if (outcome) {
    game.addMessage(target, ":exclamation: You were abducted last night!");

    if (!alien.misc.alien_kidnappings.includes(actionable.to)) {
      alien.misc.alien_kidnappings.push(actionable.to);
    };

  } else {
    game.addMessage(target, ":exclamation: Someone tried to abduct you last night but you could not be abducted!");
  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
