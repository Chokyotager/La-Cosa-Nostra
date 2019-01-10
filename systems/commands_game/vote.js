module.exports = async function (game, message, params) {

  var config = game.config;

  if (!game.isDay()) {
    await message.channel.send(":x: There is no trial during the night!");
    return null;
  };

  if (params.length < 1) {
    await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "vote <alphabet/name>` instead!");
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

  var target = params[0];

  var player = game.getPlayerMatch(target);

  if (player.score < 0.7) {
    // Disallow
    await message.channel.send(":x: I cannot find that player!");
    return null;
  };

  player = player.player;

  if (!player.isAlive()) {
    await message.channel.send(":x: That player is dead!");
    return null;
  };

  if (player.isVotedAgainstBy(self.identifier)) {
    await message.channel.send(":x: You are already voting on **" + player.getDisplayName() + "**!");
    return null;
  };

  var result = game.toggleVote(self, player);

  if (!result) {
    await message.channel.send(":x: You have used up all your votes for the day.");
  };


};

module.exports.ALLOW_PREGAME = false;
module.exports.ALLOW_GAME = true;
module.exports.ALLOW_POSTGAME = false;
