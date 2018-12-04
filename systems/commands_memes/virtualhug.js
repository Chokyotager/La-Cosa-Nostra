module.exports = function (message, params, config) {
  var endpoint = "https://media.giphy.com/media/XpgOZHuDfIkoM/giphy.gif";

  message.channel.send(endpoint);
};
