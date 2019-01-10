var auxils = require("../auxils.js");

module.exports = async function (message, params, config) {

  if (!process.timer || !["pre-game", "playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: No game in progress.");
    return null;
  };

  if (params.length < 1) {
    await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "_attributes <id>` instead!");
    return null;
  };

  var game = process.timer.game;

  var player = game.getPlayerById(params[0]);

  if (!player) {
    await message.channel.send(":x: Invalid player!");
    return null;
  }

  var attributes = player.attributes;

  if (attributes.length > 0) {
    var sendable = attributes.map((x, i) => "Attribute **[" + (i + 1) + "]**:\n" + "```fix\n" + JSON.stringify(x, auxils.jsonInfinityCensor) + "```");
  } else {
    var sendable = [":x: No attributes found!"];
  };

  await message.channel.send(sendable.join("\n"), {split: {char: "\n```", prepend: "\n```"}});

};
