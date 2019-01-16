var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var marshal = game.getPlayerByIdentifier(actionable.from);

  // Marshal seen as self-visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Marshal-marshal"});

  // Increase the votes by a factor of 3
  game.addTrialVoteOperation("multiplication", 3);
  game.addBroadcastSummary("A __Marshal__ has **tripled** the number of lynches for the day.");
  marshal.misc.marshal_uses--;

};

module.exports.TAGS = ["roleblockable", "visit"];
