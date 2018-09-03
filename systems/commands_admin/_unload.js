var deleteTimer = require("../game_reset/deleteTimer.js");

module.exports = async function (message, params, config) {

  var client = message.client;

  deleteTimer(client, config);

  await client.user.setPresence({
    status: "online",
    game: {name: "Game unloaded", type: "PLAYING"}
  });

  await message.channel.send(":ok: Unloaded current instance. Reload with `" + config["command-prefix"] + "_reinstantiate`");

};
