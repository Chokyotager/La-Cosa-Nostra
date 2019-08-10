var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var serial_killer = game.getPlayerByIdentifier(actionable.from);

  serial_killer.misc.can_pick = false;

  game.addMessage(serial_killer, ":exclamation: You did not pick a perk! As a result, your perk has been forfeit.");

  return true;

};
