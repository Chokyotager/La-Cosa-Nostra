var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var config = game.config;

  // Mediated by the lead
  var lead = game.getPlayerByIdentifier(actionable.from);
  var imparted = lead.misc.emissary_players;

  var channel = game.getChannelById(lead.misc.emissary_channel);

  if (!channel) {
    return null;
  };

  if (!game.isDay()) {
    // Open the channels

    var alive = new Array();

    var post_message = false;

    for (var i = 0; i < imparted.length; i++) {

      var imparted_player = game.getPlayerByIdentifier(imparted[i]);

      if (imparted_player.isAlive()) {
        post_message = true;

        var user = imparted_player.getDiscordUser();

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

    for (var i = 0; i < imparted.length; i++) {

      var imparted_player = game.getPlayerByIdentifier(imparted[i]);
      var user = imparted_player.getDiscordUser();

      if (user) {
        channel.overwritePermissions(user, config["base-perms"]["read"]);
      };

    };

  };

};
