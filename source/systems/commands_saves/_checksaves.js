var util = require("util");

module.exports = async function (message, params, config) {

  var timer = process.timer;

  if (!timer) {
    await message.channel.send(":x: No savable instance to check.");
    return null;
  };

  params = params || new Array();

  if (isNaN(params[0])) {
    params.unshift(null);
  };

  var depth = params[0] || 0;

  var locant = timer.game;

  var region = (params.length > 1) ? params.splice(1, Infinity).join(" ").replace("%space%", " ").split("."): new Array();

  for (var i = 0; i < region.length; i++) {

    var key = region[i];

    if (!locant[key]) {
      await message.channel.send(":x: `" + region.join(".") + "` is not a valid field.");
      return null;
    };

    if (!locant.propertyIsEnumerable(key)) {
      await message.channel.send(":x: Don't try to access restricted areas of the saves! Naughty!");
      return null;
    };

    locant = locant[key];

  };

  var output = util.inspect(locant, false, depth, false);

  var sendable = "**Saves output at `[Game]" + ((region.length > 0) ? ("." + region.join(".")) : new String()) + "`** `[depth = " + depth + "]`:\n```js\n" + output + "```";

  if (sendable.length >= 2000) {
    await message.channel.send(":x: The enumeration is too long to fit into a single message. Try with a smaller depth!");
    return null;
  };

  await message.channel.send(sendable);

};
