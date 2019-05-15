var auxils = require("../auxils.js");

module.exports = async function (message, params, config) {

  var timer = process.timer;

  if (!timer) {
    await message.channel.send(":x: No savable instance to check.");
    return null;
  };

  var game = timer.game;

  var tampers = new Object();
  var total_tampers = new Number();

  if (game.tampered_load_times && game.tampered_load_times.length > 0) {

    tampers["Main save"] = game.tampered_load_times;
    total_tampers += game.tampered_load_times.length;

  };

  for (var i = 0; i < game.players.length; i++) {

    var player = game.players[i];

    if (player.tampered_load_times && player.tampered_load_times.length > 0) {

      tampers[player.identifier + "'s save"] = player.tampered_load_times;
      total_tampers += player.tampered_load_times.length;

    };

  };

  if (total_tampers < 1) {

    await message.channel.send(":ok: The game saves have been tampered with **" + total_tampers + "** time" + auxils.vocab("s", total_tampers) + ".");

  } else {

    var tamper_log = new Array();
    for (var key in tampers) {
      tamper_log.push(key + " - " + tampers[key].length);
    };

    await message.channel.send(":ok: The game saves have been tampered with **" + total_tampers + "** time" + auxils.vocab("s", total_tampers) + ":\n```fix\n" + tamper_log.join("\n") + "```\nFor full details check the saves using `!_checksaves` as to when the tampered files were loaded.");

  };

};
