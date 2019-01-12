var auxils = require("../auxils.js");

module.exports = async function (message, params, config) {

  if (!process.timer || !["playing"].includes(process.timer.game.state)) {
    await message.channel.send(":x: No game in progress.");
    return null;
  };

  var game = process.timer.game;

  message.channel.send(":ok: Forcing fastforward.");

  game.fastforward();

};
