var auxils = require("../auxils.js");

module.exports = async function (message, params, config) {

  if (!process.timer || !["pre-game", "playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: No game in progress.");
    return null;
  };

  var game = process.timer.game;

  if (params.length < 2) {
    await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "deadline <set/change> <Unix timestamp/seconds>` instead!");
    return null;
  };

  switch (params[0].toLowerCase()) {

    case "set":
      // Set to epoch directly

      var epoch = parseInt(params[1]);

      if (isNaN(epoch)) {
        await message.channel.send(":x: Epoch time is invalid.");
        return null;
      };

      var date = new Date(epoch * 1000);
      break;

    case "change":
      // Calculate a delta

      var delta = parseInt(params[1]);

      if (isNaN(delta)) {
        await message.channel.send(":x: Epoch time is invalid.");
        return null;
      };

      var date = new Date(game.next_action.getTime() + delta * 1000);
      break;

    default:
      await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "deadline <set/change> <epoch/milliseconds>` instead!");
      break;

  };

  var max = 2147483647;
  var difference = date.getTime() - new Date().getTime();

  if (difference > max) {
    await message.channel.send(":x: You may not increase the deadline by more than " + max/1000 + " seconds!");
    return null;
  };

  if (difference <= 0) {
    await message.channel.send(":x: That would make the deadline before now! Use `" + config["command-prefix"] + "step` if you want the game to cycle immediately instead!");
    return null;
  };

  game.next_action = date;

  // Reprime the timer and save
  process.timer.prime();
  game.save();

  await message.channel.send(":ok: Set new deadline to **" + auxils.formatUTCDate(game.next_action) + "**.");

};
