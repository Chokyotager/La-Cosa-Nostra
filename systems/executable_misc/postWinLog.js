var format = require("./__formatter.js");
var texts = require("./text/texts.js");

module.exports = async function (game, faction, description) {

  var message = texts.win_log;

  message = message.replace(new RegExp("{;faction}", "g"), faction.toUpperCase());
  message = message.replace(new RegExp("{;description}", "g"), description);

  var players = game.players;
  var concat = new Array();

  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    var display_name = player.getDisplayName();
    var text = "**" + display_name + "**: " + player.getInitialRole();

    if (player.getStatus("won") === true) {
      // Add a star
      text = text + " (:star:)";
    };

    concat.push(text);
  };

  message = message.replace(new RegExp("{;role_list}", "g"), concat.join("\n"));

  await game.getLogChannel().send(format(game, message), {split: true});

};
