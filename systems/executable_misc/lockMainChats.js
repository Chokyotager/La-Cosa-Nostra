module.exports = async function (game) {
  // Open up simple chats

  var config = game.config;
  var client = game.client;

  var guild = client.guilds.get(config["server-id"]);

  // Should only be set once
  var alive = guild.roles.find(x => x.name === config["permissions"]["alive"]);

  var main_channel = guild.channels.find(x => x.name === config["channels"]["main"]);
  var whisper_channel = guild.channels.find(x => x.name === config["channels"]["whisper-log"]);

  var read_perms = config["base-perms"]["read"];

  await setPermissions([main_channel, whisper_channel], alive, read_perms);

};

async function setPermissions (channels, role, permissions) {
  for (var i = 0; i < channels.length; i++) {

    if (channels[i] === null) {
      continue;
    };

    await channels[i].overwritePermissions(role, permissions);

  };
};
