var util = require("util");
var auxils = require("../auxils.js");

module.exports = async function (message, params, config) {

  var timer = process.timer;

  if (!timer) {
    await message.channel.send(":x: No savable instance to check.");
    return null;
  };

  params = params || new Array();

  if (params.length < 2) {

    await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "_editsaves <region> <value>` instead!");
    return null;

  };

  var locant = timer.game;

  var region = params[0].replace("%space%", " ").split(".");
  for (var i = 0; i < region.length; i++) {

    var key = region[i];

    if (!locant[key] && i < (region.length - 1)) {
      await message.channel.send(":x: `" + region.join(".") + "` is not a valid field.");
      return null;
    };

    var locant_descriptor = Object.getOwnPropertyDescriptor(locant, key);

    if (locant_descriptor && (!locant_descriptor.writable || !locant_descriptor.enumerable)) {
      await message.channel.send(":x: That property is not writable.");
      return null;
    };

    locant = locant[key];

  };

  try {

    var value = params.splice(1, Infinity).join(" ");

    if (value.toLowerCase() === "delete") {
      value = "____delete@@";
    } else {
      value = JSON.parse(value, auxils.jsonReviver);
    };

  } catch (err) {

    await message.channel.send(":x: Invalid property.\n```fix\n" + err.message + "```");
    return null;

  };

  timer.game = setLocantValue(timer.game, region, value);

  function setLocantValue (json, region, value) {

    var region = Array.from(region);

    // Recursive
    if (region.length < 1) {

      if (value === "____delete@@") {

        delete json;

      } else {

        json = value;

      };
      //console.log(json);
      return json;
    };

    var key = region.splice(0, 1);

    json[key[0]] = setLocantValue(json[key[0]], region, value);
    return json;

  };

  timer.save();

  if (value === "____delete@@") {
    var output = ":ok: Deleted and saved value for `" + region.join(".") + "`";
  } else {
    var output = ":ok: Set and saved value for `" + region.join(".") + "` to:\n```js\n" + util.inspect(value, false, 0, false) + "```";
  };

  if (output.length < 2000) {

    await message.channel.send(output);

  } else {

    await message.channel.send(":ok: Set and saved value for `" + region.join(".") + "`. Cannot display value as it is too long.");

  };

};
