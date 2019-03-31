var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {
  // Set loss

  var player = game.getPlayerByIdentifier(actionable.from);

  player.setStatus("can-win", false);

  return true;

};
