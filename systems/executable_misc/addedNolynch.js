var texts = require("./text/texts.js");
var format = require("./__formatter.js");

module.exports = async function (game, voter) {

  var message = texts.nolynching;

  message = message.replace(new RegExp("{;voter}", "g"), voter.getDisplayName());

  await game.getMainChannel().send(message);

};
