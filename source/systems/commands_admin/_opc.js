module.exports = async function (message, params, config) {

  if (params.length < 2 || !["read", "write", "deny", "manage"].includes(params[0].toLowerCase())) {
    await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "_opc <read/write/deny/manage> <role name/everyone>` instead!");
    return null;
  };

  var operator = params[0].toLowerCase();
  var role_name = params.splice(1, Infinity).join(" ");

  var guild = message.client.guilds.get(config["server-id"]);

  if (role_name.toLowerCase() === "everyone") {
    var role = guild.roles.find(x => x.id === guild.id);
  } else {
    var role = guild.roles.find(x => x.name.toLowerCase() === role_name.toLowerCase());
  };

  if (!role) {
    await message.channel.send(":x: Cannot find that role!");
    return null;
  };

  var category = guild.channels.find(x => x.name === config["categories"]["private"] && x.type === "category");
  var channels = category.children.filter(x => x.type === "text").array();

  await message.channel.send(":hourglass_flowing_sand: Assigning, please wait.");

  switch (operator) {

    case "read":
      // Set read perms
      await setPerms(role, channels, config["base-perms"]["read"]);
      break;

    case "write":
      await setPerms(role, channels, config["base-perms"]["post"]);
      break;

    case "deny":
      await setPerms(role, channels, config["base-perms"]["deny"]);
      break;

    case "manage":
      await setPerms(role, channels, config["base-perms"]["manage"]);

  };

  await message.channel.send(":ok: Assigned permissions.");

  async function setPerms (role, channels, perms) {
    for (var i = 0; i < channels.length; i++) {
      await channels[i].overwritePermissions(role, perms);
    };
  };

};
