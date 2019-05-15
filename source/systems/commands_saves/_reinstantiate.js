var Timer = require("../game_templates/Timer.js");
var deleteTimer = require("../game_reset/deleteTimer.js");

module.exports = async function (message, params, config) {

  var client = message.client;

  deleteTimer(client, config);

  var timer = Timer.load(client, config);

  process.timer = timer;

  await message.channel.send(":ok: Reloaded save into file and primed the game timer.");

};
