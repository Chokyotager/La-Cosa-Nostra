var auxils = require("../auxils.js");
var attributes = require("../attributes.js");

module.exports = async function (message, params, config) {

  if (!process.timer || !["playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: No game in progress.");
    return null;
  };

  var game = process.timer.game;

  if (params.length < 2) {
    await message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "addattribute <id> <attribute> [expiry=Infinity] [tags]` instead!");
    return null;
  };

  var player = game.getPlayerById(params[0]);

  if (!player) {
    await message.channel.send(":x: Invalid player.");
    return null;
  };

  var attribute = attributes[params[1]];

  if (!attribute) {
    await message.channel.send(":x: Invalid attribute identifier `" + attribute + "`!");
    return null;
  };

  var expiry = (!params[2] || params[2].toLowerCase() === "infinity") ? Infinity : parseInt(params[2]);

  if (isNaN(expiry)) {
    await message.channel.send(":x: Invalid expiry!");
    return null;
  };

  var json_string = params.splice(3, Infinity);

  if (json_string.length >= 1) {

    try {

      var tags = JSON.parse(json_string);

    } catch (err) {

      console.log(err);
      await message.channel.send(":x: Invalid JSON tags string.");
      return null;

    };

  } else {

    var tags = undefined;

  };

  player.addAttribute(params[1], expiry, tags);

  await message.channel.send(":ok: Added attribute `" + params[1] +"` with a cycle-expiry of `" + expiry + "` to **" + player.getDisplayName() + "**.");

};
