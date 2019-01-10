var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var config = game.config;

  var recruit = game.getPlayerByIdentifier(actionable.to);
  var neighbour = game.getPlayerByIdentifier(actionable.from);

  var channel = game.getChannelById(neighbour.misc.neighbour_channel);
  var user = recruit.getDiscordUser();

  if (!user) {
    return null;
  };

  channel.overwritePermissions(user, config["base-perms"]["read"]);

};
