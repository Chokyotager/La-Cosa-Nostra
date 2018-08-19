var request = require("request-promise");

module.exports = async function (message, params, config) {
  var endpoint = "https://icanhazdadjoke.com/";

  var joke = await request({uri: endpoint, headers: {Accept: "text/plain"}});

  message.channel.send(":bamboo: " + joke);

};
