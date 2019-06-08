var auxils = require("../auxils.js");

module.exports = async function (game, message, params) {

  var config = game.config;

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

  var special_vote_types = game.getPeriodLog().special_vote_types;

  if (params.length < 1) {
    // Unvote everybody
    var voted = game.getVotesBy(self.identifier);

    for (var i = 0; i < voted.length; i++) {
      game.toggleVote(self, voted[i]);
    };

    if (game.isVotingNoLynch(self.identifier)) {
      game.toggleVote(self, "nl");
    };

    for (var i = 0; i < special_vote_types.length; i++) {
      if (special_vote_types[i].voters.some(x => x.identifier === self.identifier)) {
        game.toggleVote(self, special_vote_types[i].identifier, true);
      };
    };

    return null;
  };

  var target = params[0];

  var player = game.getPlayerMatch(target);

  // Check special votes
  var special_vote_types = game.getPeriodLog().special_vote_types;
  var max_score = {score: 0};
  for (var i = 0; i < special_vote_types.length; i++) {

    var value = auxils.hybridisedStringComparison(special_vote_types[i].name, target);

    if (value > max_score.score) {
      max_score.score = value;
      max_score.special_vote = special_vote_types[i];
    };

  };

  if (player.score < 0.7 && max_score.score < 0.7) {
    await message.channel.send(":x: I cannot find that player!");
    return null;
  };

  if (player.score > max_score.score) {

    player = player.player;

    if (!player.isVotedAgainstBy(self.identifier)) {
      await message.channel.send(":x: You are not currently voting on **" + player.getDisplayName() + "**!");
      return null;
    };

    game.toggleVote(self, player);

  } else {

    var special_vote = max_score.special_vote;

    if (!special_vote.voters.some(x => x.identifier === self.identifier)) {
      await message.channel.send(":x: You are not currently voting on the **" + special_vote.name + "**!");
      return null;
    };

    game.toggleVote(self, special_vote.identifier, true);

  };

};

module.exports.ALLOW_PREGAME = false;
module.exports.ALLOW_GAME = true;
module.exports.ALLOW_POSTGAME = false;
