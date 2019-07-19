var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var self = game.getPlayerByIdentifier(actionable.from);

  self.misc.joker_lynched = true;

  game.addMessage(self, ":exclamation: You successfully got yourself lynched!");

  // Null voter votes
  var votes = params.votes;
  var voter = game.getPlayerByIdentifier(votes[votes.length - 1].identifier);

  if (voter.identifier === self.identifier) {
    return true;
  };

  game.addAction("joker/kill_lyncher", ["cycle"], {
    name: "Joker-kill-lyncher",
    expiry: 3,
    execution: 2,
    from: actionable.from,
    to: voter.identifier
  });

  return true;

};
