var Timer = require("../game_templates/Timer.js");
var deleteTimer = require("../game_reset/deleteTimer.js");

module.exports = async function (message, params, config) {

  var client = message.client;

  if (!process.timer) {
    await message.channel.send(":x: No savable instance.");
    return null;
  };

  process.timer.game.save();

  await message.channel.send(":ok: Saved the game. Should the bot crash, please reload manually using `!_unload` and then `!_reinstantiate`.");

  deleteTimer(client, config);

  var timer = Timer.load(client, config);

  process.timer = timer;

  await message.channel.send(":ok: Reloaded.");

};
