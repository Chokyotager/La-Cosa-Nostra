var reset = require("../game_reset/reset.js");

module.exports = async function (message, params, config) {

  await message.channel.send(":hourglass_flowing_sand: Resetting, please wait. This may take a while.");

  await reset(message.client, config);

  await message.channel.send(":ok: Game reset.");

};
