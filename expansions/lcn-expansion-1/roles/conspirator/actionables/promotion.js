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
  game.addMessage(player, ":exclamation: You have been promoted to a __Mafioso__! You also gain insight into the Mafia's chat.");

  var channel = game.getChannel("mafia");
  var member = player.getGuildMember();

  if (!member) {
    logger.log(3, "Attempting to set read-only chat permissions to non-existent Mafia!");
    return true;
  };

  channel.overwritePermissions(member, config["base-perms"]["read"]);

  return true;

};
