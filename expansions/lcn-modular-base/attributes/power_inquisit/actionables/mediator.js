var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  var config = game.config;

  // Mediated by the lead
  var lead = game.getPlayerByIdentifier(actionable.from);
  var neighbours = lead.misc.neighbour_players;

  var channel = game.getChannelById(lead.misc.neighbour_channel);

  if (!channel) {
    return null;
  };

  if (!game.isDay()) {
    // Open the channels

    var alive = new Array();

    var post_message = false;

    for (var i = 0; i < neighbours.length; i++) {

      var neighbour = game.getPlayerByIdentifier(neighbours[i]);

      if (neighbour.isAlive()) {
        post_message = true;

        var user = neighbour.getDiscordUser();

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

    for (var i = 0; i < neighbours.length; i++) {

      var neighbour = game.getPlayerByIdentifier(neighbours[i]);
      var user = neighbour.getDiscordUser();

      if (user) {
        channel.overwritePermissions(user, config["base-perms"]["read"]);
      };

    };

  };

};
