var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var marshal = game.getPlayerByIdentifier(actionable.from);

  // Marshal seen as self-visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Marshal-marshal"});

  // Increase the votes by 1
  game.addTrialVoteOperation("addition", 1);
  game.addBroadcastSummary("A marshal power has been used. The number of lynches for today has increased by one.");

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["roleblockable", "visit"];
