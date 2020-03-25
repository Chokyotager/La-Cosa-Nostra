var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  rs.prototypes.basicAttack.reason = "shot by a member of the __Mafia__";

  var target = game.getPlayerByIdentifier(actionable.to);

  if (target.role.identifier !== "bulletproof_doctor") {

    var outcome = rs.prototypes.basicAttack(...arguments);

  } else {

    // Register as visit
    game.execute("visit", {visitor: actionable.from,
      target: actionable.to,
      priority: actionable.priority,
      reason: "MV-visit"});

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
