var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Seen as a visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Modular-visit"});

  game.addAction("a/power_influence/double_vote", ["postcycle"], {
    name: "Modular-double-vote",
    expiry: 2,
    from: actionable.from,
    to: actionable.to
  });

  var influencer = game.getPlayerByIdentifier(actionable.from);

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
