module.exports = async function (game, id, message) {

  var client = game.client;
  var config = game.config;

  var guild = client.guilds.get(config["server-id"]);

  var role = game.getPlayerById(id);
  var channel = guild.channels.get(role.channel.id);

  await channel.send(message);

};
