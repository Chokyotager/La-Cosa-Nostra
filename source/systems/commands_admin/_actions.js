var auxils = require("../auxils.js");

module.exports = async function (message, params, config) {

  if (!process.timer || !["pre-game", "playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: No game in progress.");
    return null;
  };

  var actions = process.timer.game.actions.actions;

  // Clone it
  actions = Array.from(actions).map((x, index) => ({action: x, used: true, index: index}));

  // Map by tags
  for (var i = 0; i < params.length; i++) {

    key = params[i].toLowerCase();

    if (key === "-*") {

      actions.forEach(x => x.used = false);

    } else if (key.startsWith("-")) {

      // Exclude
      var check = key.substring(1, Infinity);
      actions.forEach(x => (x.action.tags.includes(check) || x.action.triggers.includes(check) || x.action.identifier.includes(check)) ? x.used = false : null);

    } else {

      actions.forEach(x => (x.action.tags.includes(key) || x.action.triggers.includes(key) || x.action.identifier.includes(key)) ? x.used = true : null);

    };

  };

  actions = actions.filter(x => x.used);

  if (actions.length > 0) {
    var sendable = actions.map(x => "Index **[" + x.index + "]**:\n" + "```fix\n" + JSON.stringify(x.action, auxils.jsonInfinityCensor) + "```");
  } else {
    var sendable = [":x: No actions found!"];
  };

  await message.channel.send(sendable.join("\n"), {split: {char: "\n```", prepend: "\n```"}});

};
