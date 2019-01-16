var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  var config = game.config;

  // Mediated by the lead
  var lead = game.getPlayerByIdentifier(actionable.from);
  var cultists = lead.misc.cult_all_members;

  var channel = game.getChannelById(lead.misc.cult_channel);

  if (!channel) {
    return null;
  };

  if (!game.isDay()) {
    // Open the channels

    var alive = new Array();

    var post_message = false;

    for (var i = 0; i < cultists.length; i++) {

      var cultist = game.getPlayerByIdentifier(cultists[i]);

      if (cultist.isAlive()) {
        post_message = true;

        var user = cultist.getDiscordUser();

        if (user) {
          alive.push(user);
        };

      };

    };

    if (post_message) {
      game.sendPeriodPin(channel, "~~                                              ~~    **" + game.getFormattedDay() + "**");
    };

    for (var i = 0; i < alive.length; i++) {
      channel.overwritePermissions(alive[i], config["base-perms"]["post"]);
    };

  } else {

    for (var i = 0; i < cultists.length; i++) {

      var cultist = game.getPlayerByIdentifier(cultists[i]);
      var user = cultist.getDiscordUser();

      if (user) {
        channel.overwritePermissions(user, config["base-perms"]["read"]);
      };

    };

  };

  if (!lead.isAlive()) {
    return true;
  };

};
