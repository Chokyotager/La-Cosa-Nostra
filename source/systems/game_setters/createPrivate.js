// TODO: rewrite and assign by player instance

module.exports = async function (client, config, roles) {
  // Create private channels [A-Z]; mafia chat-log
  var category = config["categories"]["private"];

  // Bug with discord.js
  var cat_channel = client.channels.find(x => x.name === category && x.type === "category");

  // Check if category configuration is correct
  if (cat_channel === null) {
    var err = "Private category is invalid or non-existent!";
    throw new Error(err);
  };

  var everyone = cat_channel.guild.roles.find(x => x.name === "@everyone");
  var spectator = cat_channel.guild.roles.find(x => x.name === config["permissions"]["spectator"]);
  var admin = cat_channel.guild.roles.find(x => x.name === config["permissions"]["admin"]);

  var guild = client.guilds.get(config["server-id"]);

  // Create resolvables so channel creation is quicker
  var resolvables = new Array();

  // Create A-Z chats
  for (var i = 0; i < roles.length; i++) {
    resolvables.push(assignChannel(roles[i]));

    // Short hiatus to prevent ENOTFOUND connection error
    // Critical, apparently
    await new Promise(function(resolve, reject) {
      setTimeout(function () {
        resolve();
      }, 500);
    });
  };

  // If mafia has rendezvous chat
  if (config["game"]["mafia"]["has-chat"]) {
    var mafia = createPrivateChannel(config["game"]["mafia"]["chat-name"]);
  } else {
    var mafia = null;
  };

  return await Promise.all([mafia, Promise.all(resolvables)]);

  async function assignChannel (role) {
    var channel = await createPrivateChannel(role.alphabet);
    role.assignChannel(channel);

    return channel;
  };

  async function createPrivateChannel (name) {
    var channel = await guild.createChannel(name, "text", [
      {id: guild.id, deny: ["READ_MESSAGES"]}
    ]);

    var read_perms = config["base-perms"]["read"];
    var manage_perms = config["base-perms"]["manage"];

    //await channel.overwritePermissions(everyone, {READ_MESSAGES: false, SEND_MESSAGES: false});
    await channel.overwritePermissions(spectator, read_perms);
    await channel.overwritePermissions(admin, manage_perms);
    await channel.setParent(cat_channel.id);

    return channel;
  };

};
