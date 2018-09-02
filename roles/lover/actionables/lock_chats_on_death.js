var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {
  // Lock the Lovers' chat

  var config = game.config;
  var player = game.getPlayerByIdentifier(actionable.from);

  var channel = game.getChannel(player.misc.lover_channel);

  var member = player.getGuildMember();

  if (!member) {
    console.log("Attempting to close chat to non-existent Lover role!");
    return true;
  };

  channel.overwritePermissions(member, config["base-perms"]["read"]);

  // Destroy this instance
  return true;

};
