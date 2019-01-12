module.exports = async function (game, message, params) {

  var config = game.config;

  if (!config["game"]["lynch"]["no-lynch-option"]) {
    await message.channel.send(":x: The no-lynch vote is disabled.");
    return null;
  };

  if (!game.isDay()) {
    await message.channel.send(":x: There is no trial during the night!");
    return null;
  };

  var self = game.getPlayerById(message.author.id);

  if (!self) {
    await message.channel.send(":x: You are not in the game!");
    return null;
  };

  if (!self.isAlive()) {
    await message.channel.send(":x: You have died and cannot vote!");
    return null;
  };

  var result = game.toggleVote(self, "nl");

  if (!result) {
    await message.channel.send(":x: You have used up all your votes for the day.");
  };


};

module.exports.ALLOW_PREGAME = false;
module.exports.ALLOW_GAME = true;
module.exports.ALLOW_POSTGAME = false;
