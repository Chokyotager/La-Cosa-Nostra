var pinMessage = require("./pinMessage.js");

module.exports = async function (channel, message) {

  var pinnable = await channel.send(message);

  await pinMessage(pinnable);

  return pinnable;

};
