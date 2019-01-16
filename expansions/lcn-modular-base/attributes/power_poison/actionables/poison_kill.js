var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {
  // Deals an Unstoppable attack

  var poisoner = game.getPlayerByIdentifier(actionable.from);
  var poisoned = game.getPlayerByIdentifier(actionable.to);

  if (!poisoned.isAlive()) {
    return null;
  };

  rs.prototypes.unstoppableAttack.reason = "poisoned to death";

  var outcome = rs.prototypes.unstoppableAttack(...arguments);

  if (!outcome) {

    game.addMessage(poisoner, ":exclamation: Your poisoned target, **" + poisoned.getDisplayName() + "** could not be killed from the poison!");
  };

};
