var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);
  var alien = game.getPlayerByIdentifier(actionable.from);

  rs.prototypes.basicKidnap.reason = "not available";
  var outcome = rs.prototypes.basicKidnap(...arguments);

  if (outcome) {
    game.addMessage(target, ":exclamation: You were jailed last night!");
  } else {
    game.addMessage(target, ":exclamation: Someone tried to jail you last night but you could not be jailed!");
  };

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
