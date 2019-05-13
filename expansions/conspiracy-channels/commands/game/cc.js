var lcn = require("../../../../source/lcn.js");

var auxils = lcn.auxils;
var expansion_config = require("../../miscellaneous/config.js");

module.exports = async function (game, message, params) {

  // Create conspiracy channels
  // cc create <name> [users...]

  var config = game.config;

  if (params.length < 1) {

    await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "cc <create/add/remove>` instead!");
    return null;

  };

  var day = game.isDay();

  if (day && !expansion_config["enabled"]["day"]) {

    await message.channel.send(":x: You may not create/modify conspiracy channels during the day.");
    return null;

  };

  if (!day && !expansion_config["enabled"]["night"]) {

    await message.channel.send(":x: You may not create/modify conspiracy channels at night.");
    return null;

  };

  var sender = game.getPlayerById(message.author.id);

  if (sender === null) {
    await message.channel.send(":x: You are not in the game!");
    return null;
  };

  if (!sender.status.alive) {
    await message.channel.send(":x: You are dead!");
    return null;
  };

  switch (params[0].toLowerCase()) {

    case "create":

      // Only in private channel, not in CCs
      if (sender.channel.id !== message.channel.id) {
        await message.channel.send(":x: You can only create conspiracy channels from your private channel!");
        return null;
      };

      if (params.length < 3) {
        await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "cc create <name of channel> [<alphabet/name>...]` instead!");
        return null;
      };

      // Check limits
      if (game.conspiracy_channels && game.conspiracy_channels.channels.filter(x => x.owner === sender.identifier).length > expansion_config["max-ccs-per-player"]) {
        await message.channel.send(":x: You may not create more than **" + expansion_config["max-ccs-per-player"] + "** conspiracy channels.");
        return null;
      };

      var players = new Array();

      for (var i = 2; i < params.length; i++) {

        var player = getPlayer(params[i]);

        if (!player) {
          await message.channel.send(":x: I cannot find player `" + params[i] + "`!");
          return null;
        };

        if (!player.status.alive) {
          await message.channel.send(":x: **" + player.getDisplayName() + "** is dead! You cannot create conspiracy channels with dead players!");
          return null;
        };

        if (player.id === message.author.id) {
          continue;
        };

        players.push(player);

      };

      if (players.length > expansion_config["max-players-per-cc"] - 1) {
        await message.channel.send(":x: A conspiracy channel cannot exceed **" + expansion_config["max-players-per-cc"] + "** players (owner included).");
        return null;
      };

      players = auxils.getUniqueArray(players);

      // Check reserved names
      var name = params[1];

      for (var key in config["channels"]) {
        if (name.toLowerCase() === config["channels"][key].toLowerCase()) {
          await message.channel.send(":x: A conspiracy channel cannot be created with that name.");
          return null;
        };
      };

      message.channel.startTyping();

      var channel = await createCC(name, sender, players);

      await message.channel.send(":exclamation: You have created the conspiracy channel <#" + channel.id + ">.");

      await message.channel.stopTyping(true);

      break;

    case "add":

      if (!game.conspiracy_channels || !game.conspiracy_channels.channels.some(x => x.id === message.channel.id)) {
        await message.channel.send(":x: You may only add players in the respective conspiracy channels!");
        return null;
      };

      if (params.length < 2) {
        await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "cc add [<alphabet/name>...]` instead!");
        return null;
      };

      // Check ownership
      var conspiracy_channel = game.conspiracy_channels.channels.find(x => x.id === message.channel.id);
      if (conspiracy_channel.owner !== sender.identifier) {
        await message.channel.send(":x: You are not the owner of this conspiracy channel.");
        return null;
      };

      var players = new Array();

      for (var i = 1; i < params.length; i++) {

        var player = getPlayer(params[i]);

        if (!player) {
          await message.channel.send(":x: I cannot find player `" + params[i] + "`!");
          return null;
        };

        if (!player.status.alive) {
          await message.channel.send(":x: **" + player.getDisplayName() + "** is dead! You cannot create conspiracy channels with dead players!");
          return null;
        };

        if (player.id === message.author.id) {
          await message.channel.send(":x: You are already in this conspiracy channel!");
          return null;
        };

        if (conspiracy_channel.members.includes(player.identifier)) {
          await message.channel.send(":x: **" + player.getDisplayName() + "** is already in the conspiracy channel!");
          return null;
        };

        players.push(player);

      };

      if (conspiracy_channel.members + players.length > expansion_config["max-players-per-cc"]) {
        await message.channel.send(":x: A conspiracy channel cannot exceed **" + expansion_config["max-players-per-cc"] + "** players (owner included).");
        return null;
      };

      players.sort(function (a, b) {
        if (a.alphabet < b.alphabet) { return -1; };
        if (a.alphabet > b.alphabet) { return 1; };
        return 0;
      });

      players = auxils.getUniqueArray(players);

      var permissions = players.map(x => {

        var target = message.client.users.get(x.id);

        if (!target) {
          return null;
        };

        return {target: target, permissions: config["base-perms"]["post"]};

      }).filter(x => x !== null);

      await setPermissions(message.channel, permissions);

      await message.channel.send(":exclamation: Added " + auxils.pettyFormat(players.map(x => "<@" + x.id + ">")) + " to the conspiracy channel <#" + message.channel.id + ">.");

      conspiracy_channel.members = conspiracy_channel.members.concat(players.map(x => x.identifier));

      for (var i = 0; i < players.length; i++) {
        players[i].addSpecialChannel(message.channel);
      };

      break;

    case "remove":
      if (!game.conspiracy_channels || !game.conspiracy_channels.channels.some(x => x.id === message.channel.id)) {
        await message.channel.send(":x: You may only remove players in the respective conspiracy channels!");
        return null;
      };

      if (params.length < 2) {
        await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "cc add [<alphabet/name>...]` instead!");
        return null;
      };

      // Check ownership
      var conspiracy_channel = game.conspiracy_channels.channels.find(x => x.id === message.channel.id);
      if (conspiracy_channel.owner !== sender.identifier) {
        await message.channel.send(":x: You are not the owner of this conspiracy channel.");
        return null;
      };

      var players = new Array();

      for (var i = 1; i < params.length; i++) {

        var player = getPlayer(params[i]);

        if (!player) {
          await message.channel.send(":x: I cannot find player `" + params[i] + "`!");
          return null;
        };

        if (!player.status.alive) {
          await message.channel.send(":x: **" + player.getDisplayName() + "** is dead! No need to remove them from your conspiracy channel!");
          return null;
        };

        if (player.id === message.author.id) {
          await message.channel.send(":x: You may not remove yourself from your own conspiracy channel!");
          return null;
        };

        if (!conspiracy_channel.members.includes(player.identifier)) {
          await message.channel.send(":x: **" + player.getDisplayName() + "** is not in this conspiracy channel!");
          return null;
        };

        players.push(player);

      };

      players.sort(function (a, b) {
        if (a.alphabet < b.alphabet) { return -1; };
        if (a.alphabet > b.alphabet) { return 1; };
        return 0;
      });

      players = auxils.getUniqueArray(players);

      var permissions = players.map(x => {

        var target = message.client.users.get(x.id);

        if (!target) {
          return null;
        };

        return {target: target, permissions: config["base-perms"]["deny"]};

      }).filter(x => x !== null);

      await setPermissions(message.channel, permissions);

      await message.channel.send(":exclamation: Removed " + auxils.pettyFormat(players.map(x => "**" + x.getDisplayName() + "**")) + " from the conspiracy channel <#" + message.channel.id + ">.");

      for (var i = 0; i < players.length; i++) {
        conspiracy_channel.members = conspiracy_channel.members.filter(x => x !== players[i].identifier);
        players[i].removeSpecialChannel(message.channel);
      };

      break;

    default:
      await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "cc <create/add/remove>` instead!");
      return null;

  };

  game.save();

  function getPlayer (target) {

    var player = game.getPlayerMatch(target);

    if (player.score < 0.7) {
      return null;
    };

    return player.player;

  };

  async function createCC (name, owner, players) {

    if (!game.conspiracy_channels) {

      game.conspiracy_channels = {
        categories: new Array(),
        channels: new Array()
      };

    };

    // Create conspiracy channel
    var guild = game.getGuild();

    var empty_category = null;

    var categories = game.conspiracy_channels.categories;

    for (var i = 0; i < categories.length; i++) {

      var category = guild.channels.find(x => x.id === categories[i]);

      var children = category ? category.children.array().length : 0;

      if (children < 50) {
        empty_category = category;
        break;
      };

    };

    var spectator = guild.roles.find(x => x.name === config["permissions"]["spectator"]);
    var admin = guild.roles.find(x => x.name === config["permissions"]["admin"]);

    var standard_permissions = [{target: spectator, permissions: config["base-perms"]["read"]},
                       {target: admin, permissions: config["base-perms"]["manage"]}];

    if (empty_category === null) {

      var category_name = expansion_config["cc-category-prefix"] + " " + String.fromCharCode(categories.length + 65);

      empty_category = await guild.createChannel(category_name, {type: "category", permissionOverwrites: [{id: guild.id, deny: ["READ_MESSAGES"]}]});
      categories.push(empty_category.id);

      await setPermissions(empty_category, standard_permissions);

    };

    // Create channel

    var channel = await guild.createChannel(name, {type: "text", permissionOverwrites: [{id: guild.id, deny: ["READ_MESSAGES"]}], parent: empty_category});

    players.sort(function (a, b) {
      if (a.alphabet < b.alphabet) { return -1; };
      if (a.alphabet > b.alphabet) { return 1; };
      return 0;
    });

    players.unshift(owner);

    var permissions = standard_permissions.concat(players.map(x => {

      var target = message.client.users.get(x.id);

      if (!target) {
        return null;
      };

      return {target: target, permissions: config["base-perms"]["post"]};

    })).filter(x => x !== null);

    await setPermissions(channel, permissions);

    game.conspiracy_channels.channels.push({id: channel.id, owner: owner.identifier, members: players.map(x => x.identifier)});

    for (var i = 0; i < players.length; i++) {
      players[i].addSpecialChannel(channel);
    };

    await channel.send("**" + owner.getDisplayName() + "** has created a conspiracy channel <#" + channel.id + ">.\n\n**Members**:\n" + players.map(x => "<@" + x.id + ">").join("\n"));

    return channel;

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

module.exports.ALLOW_PREGAME = false;
module.exports.ALLOW_GAME = true;
module.exports.ALLOW_POSTGAME = false;
