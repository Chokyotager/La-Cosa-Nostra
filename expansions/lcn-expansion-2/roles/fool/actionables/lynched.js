var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var self = game.getPlayerByIdentifier(actionable.from);

  self.misc.fool_lynched = true;

  game.addMessage(self, ":exclamation: You successfully got yourself lynched!");

  // Null voter votes
  var votes = params.votes;

  for (var i = 0; i < votes.length; i++) {

    var voter = game.getPlayerByIdentifier(votes[i].identifier);

    if (voter.identifier === self.identifier) {
      continue;
    };

    game.addAction("fool/null_vote", ["postcycle"], {
      name: "Fool-null-vote",
      expiry: 3,
      execution: 2,
      from: actionable.from,
      to: voter.identifier
    });

    game.addMessage(voter, ":exclamation: Your votes will be nulled the next day.");

  };

  return true;

};
