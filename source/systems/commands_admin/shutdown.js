var logger = process.logger;

module.exports = async function (message, params, config) {
  await message.channel.send(":computer: Shutting down...");

  var client = message.client;

  client.user.setPresence({
    status: 'offline'
  });

  client.destroy();

  logger.log(2, "Bot shut down");

  process.exit();

};
