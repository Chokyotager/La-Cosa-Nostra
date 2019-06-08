var lcn = require("../../../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  // Forgery
  var forger = game.getPlayerByIdentifier(actionable.from);
  var vote_from = game.getPlayerByIdentifier(actionable.to);
  var vote_to = game.getPlayerByIdentifier(actionable.target);

  var p1_name = vote_from.identifier === forger.identifier ? "yourself" : vote_from.getDisplayName();
  var p2_name = vote_to.identifier === forger.identifier ? "yourself" : vote_to.getDisplayName();

  vote_from.setStatus("vote-blocked", false);

  if (vote_from.role_identifier === "unknown_god") {
    forger.misc.forgeries_left--;
    forger.getPrivateChannel().send(":pencil: The forged vote from **" + p1_name + "** to **" + p2_name + "** failed! You now have __" + forger.misc.forgeries_left + "__ forge use" + auxils.vocab("s", forger.misc.forgeries_left) + " left.");
    return true;
  };

  if (vote_from.hasAttribute("prosperity_charm")) {

    forger.misc.forgeries_left--;
    forger.getPrivateChannel().send(":pencil: The forged vote from **" + p1_name + "** to **" + p2_name + "** failed! You now have __" + forger.misc.forgeries_left + "__ forge use" + auxils.vocab("s", forger.misc.forgeries_left) + " left.");

    var attributes = vote_from.attributes;

    attributes.sort((a, b) => a.expiry - b.expiry);

    for (var i = 0; i < attributes.length; i++) {

      if (attributes[i].identifier !== "prosperity_charm") {
        continue;
      };

      if (typeof attributes[i].tags.amount === "number") {
        attributes[i].tags.amount--;
      };

      if (attributes[i].tags.amount < 1) {
        // Remove
        attributes.splice(i, 1);

        if (!vote_from.hasAttribute("prosperity_charm")) {
          game.actions.delete(x => x.identifier === "a/prosperity_charm/charm" && x.from === actionable.from);
          game.actions.delete(x => x.identifier === "a/prosperity_charm/attacked" && x.from === actionable.from);
          break;
        };

      };

    };

    return true;

  };

  // Retract and forge the vote
  var voted = game.getVotesBy(vote_from.identifier);

  for (var i = 0; i < voted.length; i++) {
    game.toggleVote(vote_from, voted[i]);
  };

  if (game.isVotingNoLynch(vote_from.identifier)) {
    game.toggleVote(vote_from, "nl");
  };

  var special_vote_types = game.getPeriodLog().special_vote_types;

  for (var i = 0; i < special_vote_types.length; i++) {
    if (special_vote_types[i].voters.some(x => x.identifier === vote_from.identifier)) {
      game.toggleVote(vote_from, special_vote_types[i].identifier, true);
    };
  };

  // Forge the vote
  game.toggleVote(vote_from, vote_to);

  vote_from.setStatus("vote-blocked", true);

  vote_from.misc.forgery = game.getStep();
  vote_from.misc.forger = actionable.from;

  //vote_from.getPrivateChannel().send(":exclamation: Your vote has been forged. You may not change the forged vote.");

  forger.misc.forgeries_left--;

  forger.getPrivateChannel().send(":pencil: You are now forging a vote from **" + p1_name + "** to **" + p2_name + "**. You have __" + forger.misc.forgeries_left + "__ forge use" + auxils.vocab("s", forger.misc.forgeries_left) + " left.");

  return true;

};
