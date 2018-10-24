var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {
  
  var config = game.config;
  var player = game.getPlayerByIdentifier(actionable.to);

  var channel = game.getChannel("mafia");

  var member = player.getGuildMember();

  if (!member) {
    console.log("Attempting to close chat to non-existent Mafia!");
    return true;
  };

  channel.overwritePermissions(member, config["base-perms"]["read"]);

  // Destroy this instance
  return true;

};
