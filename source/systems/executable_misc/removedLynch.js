var texts = require("./text/texts.js");
var format = require("./__formatter.js");

module.exports = async function (game, voter, voted) {

  var message = texts.unlynching;

  message = message.replace(new RegExp("{;voter}", "g"), voter.getDisplayName());
  message = message.replace(new RegExp("{;voted}", "g"), voted.getDisplayName());

  await game.getMainChannel().send(message);

};
