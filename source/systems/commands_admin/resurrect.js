module.exports = async function (message, params, config) {

  if (!process.timer || !["pre-game", "playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: No game going on.");
    return null;
  };

  var game = process.timer.game;
  var config = game.config;

  if (params.length !== 1) {
    await message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "resurrect <id>` instead!");
    return null;
  };

  var id = params[0];

  var player = game.getPlayerById(id);

  if (player.isAlive()) {
    await message.channel.send(":x: That player is alive!");
    return null;
  };

  var alive_role = guild.roles.find(x => x.name === config["permissions"]["alive"]);
  var dead_role = guild.roles.find(x => x.name === config["permissions"]["dead"]);

  var user = player.getDiscordUser();

  await user.addRole(alive_role);
  await user.removeRole(dead_role);

  player.status.alive = true;

  game.save();

  await message.channel.send(":ok: Revived player. Please manually ensure that they have access to the private channels.");

};
