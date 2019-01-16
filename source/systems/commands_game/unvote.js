module.exports = async function (game, message, params) {

  var config = game.config;

  if (!game.isDay()) {
    await message.channel.send(":x: There is no trial during the night!");
    return null;
  };

  var self = game.getPlayerById(message.author.id);

  if (!self.isAlive()) {
    await message.channel.send(":x: You have died and cannot vote!");
    return null;
  };

  if (params.length < 1) {
    // Unvote everybody
    var voted = game.getVotesBy(self.identifier);

    for (var i = 0; i < voted.length; i++) {
      game.toggleVote(self, voted[i]);
    };

    if (game.isVotingNoLynch(self.identifier)) {
      game.toggleVote(self, "nl");
    };

    return null;
  };

  var target = params[0];

  var player = game.getPlayerMatch(target);

  if (player.score < 0.7) {
    await message.channel.send(":x: I cannot find that player!");
    return null;
  };

  player = player.player;

  if (!player.isVotedAgainstBy(self.identifier)) {
    await message.channel.send(":x: You are not currently voting on **" + player.getDisplayName() + "**!");
    return null;
  };

  game.toggleVote(self, player);

};

module.exports.ALLOW_PREGAME = false;
module.exports.ALLOW_GAME = true;
module.exports.ALLOW_POSTGAME = false;
