module.exports = async function (message, params, config) {

  if (!process.timer || !["pre-game", "playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: No game going on.");
    return null;
  };

  var game = process.timer.game;
  var config = game.config;

  if (!game.isDay()) {
    await message.channel.send(":x: You may only reload the trial vote message during the day.");
    return null;
  };

  game.__reloadTrialVoteMessage();
  await message.channel.send(":ok: Reloaded the trial vote message.");
  return null;

};
