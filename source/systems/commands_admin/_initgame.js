var logger = process.logger;

var initGame = require("../game_setters/initGame.js");

module.exports = async function (message, params, config) {

  await message.channel.send(":ok: Creating game.");

  try {

    await initGame(message.client, config);

  } catch (err) {

    logger.log(4, "Game creation failed.");
    logger.logError(err);
    
    await message.channel.send(":x: Failed to create game. Run `" + config["command-prefix"] + "_verifysetup` to troubleshoot. Please check the console for full details.");

    process.setStatus(message.client);

    return null;

  };

  await message.channel.send(":ok: Game creation complete.");

};
