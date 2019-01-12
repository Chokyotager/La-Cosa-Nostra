var format = require("./__formatter.js");
var texts = require("./text/texts.js");
var auxils = require("../auxils.js");

module.exports = async function (game, faction, description) {

  var message = texts.prime;

  message = message.replace(new RegExp("{;current_utc_formatted}", "g"), auxils.formatUTCDate(new Date()))

  var players = game.players;
  var concat = new Array();

  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    var display_name = player.getDisplayName();
    var text = "**" + display_name + "**";

    concat.push(text);
  };

  message = message.replace(new RegExp("{;players}", "g"), concat.join("\n"));

  await game.getLogChannel().send(format(game, message));

};
