var initGame = require("../game_setters/initGame.js");

module.exports = async function (message, params, config) {

  await message.channel.send(":ok: Creating game.");

  await initGame(message.client, config);

  await message.channel.send(":ok: Game creation complete.");

};
