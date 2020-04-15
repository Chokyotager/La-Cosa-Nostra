var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {
  // Deals an Unstoppable attack

  var bomber = game.getPlayerByIdentifier(actionable.from);
  var bombed = game.getPlayerByIdentifier(actionable.to);

  if (!bombed.isAlive()) {
    return null;
  };

  rs.prototypes.powerfulAttack.reason = "exploded";

  var outcome = rs.prototypes.powerfulAttack(...arguments, true);

};
