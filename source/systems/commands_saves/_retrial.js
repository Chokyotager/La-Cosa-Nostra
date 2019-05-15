module.exports = async function (message, params, config) {

  if (!process.timer || !["pre-game", "playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: No game in progress.");
    return null;
  };

  var game = process.timer.game;

  if (!game.isDay()) {
    await message.channel.send(":x: You may only recreate a trial during the day.");
    return null;
  };

  // Do not load pre-emptives
  game.createTrialVote(false);

  game.clearTrialVoteCollectors();
  game.getPeriodLog().voting_halted = false;

  await message.channel.send(":ok: Trial vote recreated. Please ensure that reaction votes are functional.");

};
