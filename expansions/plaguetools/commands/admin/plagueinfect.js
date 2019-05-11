module.exports = async function (message, params, config) {

  if (!process.timer || !["pre-game", "playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: No game in progress.");
    return null;
  };

  var game = process.timer.game;

  if (params.length < 1) {
    message.channel.send(":x: Wrong syntax. Please use `" + config["command-prefix"] + "plagueinfect <id>` instead!");
    return null;
  };

  var target = game.getPlayerById(params[0]);

  if (!target) {
    await message.channel.send(":x: Invalid player!");
    return null;
  };

  if (target.misc.plague_infected) {
    await message.channel.send(":x: **" + target.getDisplayName() + "** is already infected!");
    return null;
  };

  game.addAction("plaguebearer/infection_spread", ["retrovisit"], {
    from: target,
    to: target,
    expiry: Infinity,
    execution: 2,
    tags: ["permanent", "infection"],
    priority: 10
  });

  game.addAction("plaguebearer/infection_outvisit", ["outvisit"], {
    from: target,
    to: target,
    expiry: Infinity,
    execution: 2,
    tags: ["permanent", "infection"],
    priority: 10
  });

  target.misc.plague_infected = true;

  game.save();

  await message.channel.send(":ok: Infected player **" + target.getDisplayName() + "**.");

};
