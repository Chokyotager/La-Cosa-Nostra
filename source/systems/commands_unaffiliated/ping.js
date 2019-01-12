module.exports = function (message, params, config) {
  var timestamp = new Date(message.createdTimestamp);
  var now = new Date();

  var delta = now.getTime() - timestamp.getTime();

  message.channel.send(":ping_pong: Pong! (" + delta + " ms)");
};
