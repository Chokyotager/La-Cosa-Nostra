module.exports = function (message, params, config) {
  var endpoint = "https://media0.giphy.com/media/5wWf7GMbT1ZUGTDdTqM/giphy.gif";

  message.channel.send(endpoint);
};
