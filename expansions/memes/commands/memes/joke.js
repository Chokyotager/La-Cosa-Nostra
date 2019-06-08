var request = require("request-promise");

module.exports = async function (message, params, config) {
  var endpoint = "https://icanhazdadjoke.com/";

  message.channel.startTyping();

  var joke = await request({uri: endpoint, headers: {Accept: "text/plain"}});

  await message.channel.send(":bamboo: " + joke);
  await message.channel.stopTyping();

};
