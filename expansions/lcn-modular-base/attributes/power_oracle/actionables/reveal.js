var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.reveal_target);

  // Role of target is added
  game.addBroadcastSummary("An oracle reveal from a dead user has sufficed. Their targets' role is __" + target.getDisplayRole(false) + "__.");

  return true;

};
