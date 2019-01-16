var format = require("./__formatter.js");
var texts = require("./text/texts.js");

module.exports = async function (role) {

  var message = texts.win_message;

  message = message.replace(new RegExp("{@player}", "g"), "<@" + role.id + ">");

  await role.getPrivateChannel().send(message);
};
