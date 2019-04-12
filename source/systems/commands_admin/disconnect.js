module.exports = async function (message, params, config) {

  await message.channel.send(":desktop: Disconnecting client... may attempt reconnection if `auto-reconnect` is set to true.");

  message.client.destroy();

};
