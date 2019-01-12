module.exports = function (message, params, config) {

  message.channel.send(":heart: Heartbeat pong! (" + message.client.ping + " ms)");
};
