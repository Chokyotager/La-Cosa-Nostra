var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  // Seen as a visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Lawyer-frame"});

  var target = game.getPlayerByIdentifier(actionable.to);

  target.setGameStat("detection-immunity", -1, "set");

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
