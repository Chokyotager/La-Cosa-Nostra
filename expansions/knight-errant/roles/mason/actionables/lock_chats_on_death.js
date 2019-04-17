var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {
  // Lock the Lovers' chat

  var config = game.config;
  var player = game.getPlayerByIdentifier(actionable.from);

  var channel = game.getChannel(player.misc.mason_channel);

  var member = player.getGuildMember();

  if (!member) {
    console.log("Attempting to close chat to non-existent Mason role!");
    return true;
  };

  channel.overwritePermissions(member, config["base-perms"]["read"]);

  // Destroy this instance
  return true;

};
