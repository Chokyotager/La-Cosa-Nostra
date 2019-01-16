var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  // Seen as a visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "SE-double-vote"});

  game.addAction("social_engineer/double_vote", ["postcycle"], {
    name: "SE-double-vote",
    expiry: 2,
    from: actionable.from,
    to: actionable.to
  });

  var social_engineer = game.getPlayerByIdentifier(actionable.from);

  social_engineer.misc.se_influence_log.unshift(actionable.to);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
