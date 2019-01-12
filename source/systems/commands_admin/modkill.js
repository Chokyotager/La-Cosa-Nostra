module.exports = async function (message, params, config) {

  if (!process.timer || !["pre-game", "playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: No game going on.");
    return null;
  };

  var game = process.timer.game;
  var config = game.config;

  if (params.length !== 1) {
    await message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "modkill <id>` instead!");
    return null;
  };

  var id = params[0];

  var response = game.modkill(id);

  if (response) {
    await message.channel.send(":ok: Modkilled.");
  } else {
    await message.channel.send(":x: Could not modkill player.");
  };

};
