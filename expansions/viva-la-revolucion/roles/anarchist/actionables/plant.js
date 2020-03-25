var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Anarchist-bomb"});

  if (target.role_identifier !== "bombproof_bomb_defuser") {

    game.addAction("anarchist/bomb", ["cycle"], {
      name: "Bomb-kill",
      expiry: 3,
      execution: 3,
      from: actionable.from,
      to: actionable.to,
      attack: actionable.target,
      priority: 12,
      tags: ["bomb"]
    });

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
