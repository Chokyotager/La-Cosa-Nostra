module.exports = async function (game, channel_id, message_id) {

  var client = game.client;
  var config = game.config;

  var guild = client.guilds.get(config["server-id"]);
  var channel = guild.channels.get(channel_id);

  var message = await channel.fetchMessage(message_id);

  await message.delete();

};
