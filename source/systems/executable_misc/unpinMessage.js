module.exports = async function (game, channel_id, message_id) {

  var config = game.config;
  var client = game.client;

  var guild = client.guilds.get(config["server-id"]);
  var channel = guild.channels.get(channel_id);

  var message = await channel.fetchMessage(message_id);

  if (message !== null && message.pinned) {
    // Unpin
    await message.unpin();
  };

};
