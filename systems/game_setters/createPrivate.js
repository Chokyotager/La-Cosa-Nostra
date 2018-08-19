// TODO: rewrite and assign by player instance

module.exports = async function (client, config, roles) {
  // Create private channels [A-Z]; mafia chat-log
  var category = config["categories"]["private"];

  // Bug with Discord.js
  var cat_channel = client.channels.find(x => x.name === category && x.type === null);

  // Check if category configuration is correct
  if (cat_channel === null) {
    var err = "Private category is invalid or non-existent!";
    throw new Error(err);
  };

  var everyone = cat_channel.guild.roles.find("name", "@everyone");
  var spectator = cat_channel.guild.roles.find("name", config["permissions"]["spectator"]);

  var guild = client.guilds.get(config["server-id"]);

  // If mafia has rendezvous chat
  if (config["game"]["mafia"]["has-chat"]) {
    var mafia = await createPrivateChannel(config["game"]["mafia"]["chat-name"]);
  } else {
    var mafia = null;
  };

  // Create resolvables so channel creation is quicker
  var resolvables = new Array();

  // Create A-Z chats
  for (var i = 0; i < roles.length; i++) {
    resolvables.push(assignChannel(roles[i]));
  };

  return await Promise.all([mafia, Promise.all(resolvables)]);

  async function assignChannel (role) {
    var channel = await createPrivateChannel(role.alphabet);
    role.assignChannel(channel);

    return channel;
  };

  async function createPrivateChannel (name) {
    var channel = await guild.createChannel(name, "text");

    var read_perms = config["base-perms"]["read"];

    await channel.overwritePermissions(everyone, {READ_MESSAGES: false, SEND_MESSAGES: false});
    await channel.overwritePermissions(spectator, read_perms);
    await channel.setParent(cat_channel.id);

    return channel;
  };

};
