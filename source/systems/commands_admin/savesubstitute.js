module.exports = async function (message, params, config) {

  if (!process.timer) {
    await message.channel.send(":x: No instance loaded.");
    return null;
  };

  if (!process.timer.game.exists(x => x.id === params[0])) {
    await message.channel.send(":x: Cannot find player to substitute!");
    return null;
  };

  await process.timer.game.substitute(params[0], params[1], false);
  process.timer.game.save();

  await message.channel.send(":ok: Save substitution complete (" + params[0] + " → " + params[1] + ").");

  await message.channel.send(":exclamation: Because the substitution only accounts for the bot, please:\n(1) Manually assign roles\n(2) Manually assign nickname\n(3) Manually assign channels\n\n**The completed substitution only accounts for meta-votes.**");

};
