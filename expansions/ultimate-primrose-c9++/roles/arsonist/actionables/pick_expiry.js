var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var arsonist = game.getPlayerByIdentifier(actionable.from);

  arsonist.misc.can_pick = false;

  game.addMessage(arsonist, ":exclamation: You did not pick a perk! As a result, your perk has been forfeit.");

  return true;

};
