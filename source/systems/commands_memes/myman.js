module.exports = function (message, params, config) {
  var endpoint = "https://img.memecdn.com/my-man_o_1937775.jpg";

  message.channel.send(endpoint);
};
