module.exports = async function (client, config) {
  // Open up simple chats

  var guild = client.guilds.get(config["server-id"]);

  // Should only be set once
  var admin = guild.roles.find(x => x.name === config["permissions"]["admin"]);
  var spectator = guild.roles.find(x => x.name === config["permissions"]["spectator"]);
  var alive = guild.roles.find(x => x.name === config["permissions"]["alive"]);
  var dead = guild.roles.find(x => x.name === config["permissions"]["dead"]);
  var pre = guild.roles.find(x => x.name === config["permissions"]["pre"]);
  var post = guild.roles.find(x => x.name === config["permissions"]["aftermath"]);

  var log_channel = guild.channels.find(x => x.name === config["channels"]["log"]);
  var vote_channel = guild.channels.find(x => x.name === config["channels"]["voting"]);
  var main_channel = guild.channels.find(x => x.name === config["channels"]["main"]);
  var whisper_channel = guild.channels.find(x => x.name === config["channels"]["whisper-log"]);
  var roles_channel = guild.channels.find(x => x.name === config["channels"]["roles"]);

  var all = [log_channel, vote_channel, main_channel, whisper_channel, roles_channel];

  var read_perms = config["base-perms"]["read"];
  var post_perms = config["base-perms"]["post"];
  var manage_perms = config["base-perms"]["manage"];

  await setPermissions(all, admin, manage_perms);
  await setPermissions(all, spectator, read_perms);
  await setPermissions(all, dead, read_perms);
  await setPermissions(all, alive, read_perms);
  await setPermissions(all, pre, read_perms);

  await setPermissions([log_channel, vote_channel, roles_channel], post, read_perms);
  await setPermissions([main_channel, whisper_channel], post, post_perms);

};

async function setPermissions (channels, role, permissions) {
  for (var i = 0; i < channels.length; i++) {

    if (channels[i] === null) {
      continue;
    };

    await channels[i].overwritePermissions(role, permissions);
  };
};
