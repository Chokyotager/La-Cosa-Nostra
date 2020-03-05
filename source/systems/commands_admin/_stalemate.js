module.exports = async function (message, params, config) {

  if (!process.timer || !["pre-game", "playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: No game in progress.");
    return null;
  };

  var game = process.timer.game;

  // Declare stalemate
  game.primeWinLog("stalemate", "Nobody wins.");
  game.postWinLog();
  game.endGame();

  await message.channel.send(":ok: Forced a game stalemate.");

};
