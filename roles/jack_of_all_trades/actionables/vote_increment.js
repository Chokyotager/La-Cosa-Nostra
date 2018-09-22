var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  // Seen as a visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "JOAT-block"});

  game.addAction("jack_of_all_trades/double_vote", ["postcycle"], {
    name: "JOAT-double-vote",
    expiry: 2,
    from: actionable.from,
    to: actionable.to
  });

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  if (target.isAlive()) {
    game.addMessage(from, ":exclamation: You successfully executed your action!");
    from.misc.joat_actions_left--;
  };

};

module.exports.TAGS = ["drivable", "roleblockable"];
