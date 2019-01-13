var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var config = game.config;

  var mentee = game.getPlayerByIdentifier(actionable.to);
  var mentor = game.getPlayerByIdentifier(actionable.from);

  var channel = game.getChannelById(mentor.misc.cult_channel);
  var user = recruit.getDiscordUser();

  if (!user) {
    return null;
  };

  channel.overwritePermissions(user, config["base-perms"]["read"]);

};
