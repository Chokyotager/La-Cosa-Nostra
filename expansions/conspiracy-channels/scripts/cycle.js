var expansion_config = require("../miscellaneous/config.js");

module.exports = async function (game) {

  var config = game.config;

  if (!game.conspiracy_channels) {
    return null;
  };

  // Cycle through conspiracy channels
  var day = game.isDay();

  if (day && !expansion_config["enabled"]["day"]) {

    await lockCCs();

  } else if (day && expansion_config["enabled"]["day"]) {

    await postPeriodic();
    await openCCs();

  };

  if (!day && !expansion_config["enabled"]["night"]) {

    await lockCCs();

  } else if (!day && expansion_config["enabled"]["night"]) {

    await postPeriodic();
    await openCCs();

  };

  function getActiveCCs () {

    var ret = new Array();

    for (var i = 0; i < game.conspiracy_channels.channels.length; i++) {

      var conspiracy_channel = game.conspiracy_channels.channels[i];
      var channel = game.getChannelById(conspiracy_channel.id);

      var details = {channel: channel, users: new Array()};

      for (var j = 0; j < conspiracy_channel.members.length; j++) {

        var player = game.getPlayerByIdentifier(conspiracy_channel.members[j]);

        if (player.isAlive()) {
          details.users.push(player.getDiscordUser());
        };

      };

      if (details.users.length < 1) {
        continue;
      };

      ret.push(details);

    };

    return ret;

  };

  async function postPeriodic () {

    var active = getActiveCCs();

    var cache = new Array();

    for (var i = 0; i < active.length; i++) {

      var message = active[i].channel.send("~~                                              ~~    **" + game.getFormattedDay() + "**");

      cache.push(message);

    };

    await Promise.all(cache);

  };

  async function lockCCs () {

    var active = getActiveCCs();

    var cache = new Array();

    for (var i = 0; i < active.length; i++) {

      var permissions = active[i].users.map(function (x) {

        return {target: x, permissions: config["base-perms"]["read"]};

      });

      cache.push(setPermissions(active[i].channel, permissions));

    };

    await Promise.all(cache);

  };

  async function openCCs () {

    var active = getActiveCCs();

    var cache = new Array();

    for (var i = 0; i < active.length; i++) {

      var permissions = active[i].users.map(function (x) {

        return {target: x, permissions: config["base-perms"]["post"]};

      });

      cache.push(setPermissions(active[i].channel, permissions));

    };

    await Promise.all(cache);

  };

  async function setPermissions (channel, permissions) {

    var cache = new Array();

    for (var i = 0; i < permissions.length; i++) {

      if (!permissions[i].target) {
        continue;
      };

      cache.push(channel.overwritePermissions(permissions[i].target, permissions[i].permissions));

    };

    await Promise.all(cache);

  };

};
