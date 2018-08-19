module.exports = async function (client, config) {
  // Open up simple chats

  var guild = client.guilds.get(config["server-id"]);

  // Should only be set once
  var spectator = guild.roles.find("name", config["permissions"]["spectator"]);
  var alive = guild.roles.find("name", config["permissions"]["alive"]);
  var dead = guild.roles.find("name", config["permissions"]["dead"]);

  var log_channel = guild.channels.find("name", config["channels"]["log"]);
  var vote_channel = guild.channels.find("name", config["channels"]["voting"]);
  var main_channel = guild.channels.find("name", config["channels"]["main"]);
  var whisper_channel = guild.channels.find("name", config["channels"]["whisper-log"]);
  var roles_channel = guild.channels.find("name", config["channels"]["roles"]);

  var all = [log_channel, vote_channel, main_channel, whisper_channel, roles_channel];

  var read_perms = config["base-perms"]["read"];

  await setPermissions(all, spectator, read_perms);
  await setPermissions(all, dead, read_perms);
  await setPermissions(all, alive, read_perms);

};

async function setPermissions (channels, role, permissions) {
  for (var i = 0; i < channels.length; i++) {

    if (channels[i] === null) {
      continue;
    };

    await channels[i].overwritePermissions(role, permissions);
  };
};
