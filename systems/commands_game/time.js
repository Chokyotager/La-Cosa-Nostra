var auxils = require("../auxils.js");

module.exports = async function (game, message, params) {

  var timer = game.timer;

  var current = new Date();
  var designation = timer.designated;

  // Work in progress
  var delta = designation.getTime() - current.getTime();

  if (delta < 1000) {
    await message.channel.send(":clock12: Time is up.");
    return null;
  };

  var formatted = auxils.formatDate(delta);

  if (game.state === "pre-game") {
    await message.channel.send(":clock12: **" + formatted + "** left before game starts.");
  } else {
    await message.channel.send(":clock12: **" + formatted + "** left before **" + game.getFormattedDay(1) + "**.");
  };

};

module.exports.ALLOW_PREGAME = true;
module.exports.ALLOW_GAME = true;
module.exports.ALLOW_POSTGAME = false;
