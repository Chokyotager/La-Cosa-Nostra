var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Send visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "fireproof_firefighter-visit"});

  // Remove douse
  var extinguisher = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  if (target.misc.doused === true) {

    target.misc.doused = false;
    
  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
