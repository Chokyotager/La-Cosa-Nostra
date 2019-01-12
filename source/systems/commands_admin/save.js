module.exports = async function (message, params, config) {

  if (!process.timer) {
    await message.channel.send(":x: No savable instance.");
    return null;
  };

  process.timer.game.save();

  await message.channel.send(":ok: Saved the game.");

};
