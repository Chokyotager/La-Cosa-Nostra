var auxils = require("../auxils.js");

module.exports = async function (message, params, config) {

  if (!process.timer || !["playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: No game in progress.");
    return null;
  };

  var game = process.timer.game;

  for (var i = 0; i < game.players.length; i++) {

    game.players[i].clearVotes();

  };

  game.clearNoLynchVotes();

  if (game.isDay()) {
    game.__reloadTrialVoteMessage();
  };

  game.save();

  await message.channel.send(":ok: All votes cleared.");

};
