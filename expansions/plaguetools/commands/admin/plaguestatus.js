var lcn = require("../../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = async function (message, params, config) {

  if (!process.timer || !["pre-game", "playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: No game in progress.");
    return null;
  };

  var players = process.timer.game.players.filter(x => x.isAlive());

  var infected = new Array();

  for (var i = 0; i < players.length; i++) {

    if (players[i].misc.plague_infected) {

      infected.push(players[i]);

    };

  };

  var concat = " They are: " + auxils.pettyFormat(infected.map(x => "**" + x.getDisplayName() + "**")) + ".";

  await message.channel.send("**" + infected.length + "/" + players.length + "** player(s) alive are infected." + (players.length > 0 ? concat : ""));

};
