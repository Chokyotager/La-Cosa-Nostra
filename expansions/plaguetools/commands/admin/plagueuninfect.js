module.exports = async function (message, params, config) {

  if (!process.timer || !["pre-game", "playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: No game in progress.");
    return null;
  };

  var game = process.timer.game;

  if (params.length < 1) {
    message.channel.send(":x: Wrong syntax. Please use `" + config["command-prefix"] + "plagueuninfect <id>` instead!");
    return null;
  };

  var target = game.getPlayerById(params[0]);

  if (!target) {
    await message.channel.send(":x: Invalid player!");
    return null;
  };

  if (!target.misc.plague_infected) {
    await message.channel.send(":x: **" + target.getDisplayName() + "** is not infected!");
    return null;
  };

  game.actions.delete(x => (x.identifier === "plaguebearer/infection_spread" || x.identifier === "plaguebearer/infection_outvisit") && x.from === target.identifier && x.to === target.identifier);

  target.misc.plague_infected = false;

  game.save();

  await message.channel.send(":ok: Uninfected player **" + target.getDisplayName() + "**.");

};
