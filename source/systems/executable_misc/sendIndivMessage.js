module.exports = async function (game, identifier, message) {

  var client = game.client;
  var config = game.config;

  var guild = client.guilds.get(config["server-id"]);

  var role = game.getPlayerByIdentifier(identifier);
  var channel = guild.channels.get(role.channel.id);

  await channel.send(message);

};
