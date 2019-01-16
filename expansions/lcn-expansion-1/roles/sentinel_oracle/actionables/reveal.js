var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var oracle = game.getPlayerByIdentifier(actionable.from);

  if (!oracle.misc.oracle_last_target) {
    // No target
    return true;
  };

  var target = game.getPlayerByIdentifier(oracle.misc.oracle_last_target);

  // Role of target is added
  game.addBroadcastSummary("An __Oracle__ has died. Their targets' role is __" + target.getDisplayRole() + "__.");

  return true;

};
