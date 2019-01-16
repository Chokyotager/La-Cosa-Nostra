var format = require("./__formatter.js");
var texts = require("./text/texts.js");
var auxils = require("../auxils.js");

module.exports = async function (game, faction, description) {

  var message = texts.delay_notice;

  message = message.replace(new RegExp("{;current_utc_formatted}"), auxils.formatUTCDate(new Date()))

  await game.getLogChannel().send(format(game, message));

};
