var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Send visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "fireproof_firefighter-visit"});

  // Remove bomb
  var from = game.getPlayerByIdentifier(actionable.from);
  var to = game.getPlayerByIdentifier(actionable.to);

  var removed = game.actions.delete(x => x.tags.includes("bomb") && x.to === actionable.to);

  if (removed.length > 0) {
    return true;
  } else {
    return false;
  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
