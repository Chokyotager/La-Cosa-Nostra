var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Crosshair fails if target is killed during the day
  if (game.isDay()) {
    return true;
  };

  var from = game.getPlayerByIdentifier(actionable.from);
  var to = game.getPlayerByIdentifier(actionable.crosshair_target);

  if (!to.isAlive()) {
    return true;
  };

  rs.prototypes.unstoppableAttack.reason = "killed in a crosshair";

  var outcome = rs.prototypes.unstoppableAttack({from: actionable.from, to: actionable.crosshair_target}, game, params, true);

  if (!outcome) {

    game.addMessage(from, ":exclamation: Your could not attack your crosshair target!");

  };

  return true;

};
