var lcn = require("../../../../../source/lcn.js");
var logger = process.logger;

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Check if XK roles left
  var primary_left = game.exists(x => x.role["see-mafia-chat"] && x.isAlive());

  if (primary_left) {
    return null;
  };

  // Promote the player to Mafioso
  var player = game.getPlayerByIdentifier(actionable.to);

  if (!player.isAlive()) {
    return true;
  };

  player.changeRole("mafioso");
  game.addMessage(player, ":exclamation: You have been promoted to a __Mafioso__!");

  return true;

};
