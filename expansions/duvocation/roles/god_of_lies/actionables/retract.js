module.exports = function (actionable, game, params) {

  var forged = game.getPlayerByIdentifier(actionable.to);

  // Retract and forge the vote
  var voted = game.getVotesBy(forged.identifier);

  forged.setStatus("vote-blocked", false);

  for (var i = 0; i < voted.length; i++) {
    game.toggleVote(forged, voted[i]);
  };

  forged.misc.forger = null;

  //forged.getPrivateChannel().send(":exclamation: The forged vote has been retracted.");

  return true;

};
