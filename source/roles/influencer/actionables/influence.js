var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  // Seen as a visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Influencer-double-vote"});

  game.addAction("influencer/double_vote", ["postcycle"], {
    name: "Influencer-double-vote",
    expiry: 2,
    from: actionable.from,
    to: actionable.to
  });

  var influencer = game.getPlayerByIdentifier(actionable.from);

  influencer.misc.influencer_log.unshift(actionable.to);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
