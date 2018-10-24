var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Marksman-visit"});

  game.addAction("marksman/preemptive", ["retrovisit"], {
    name: "Marksman-preemptive",
    expiry: 1,
    from: actionable.from,
    to: actionable.to,
    attack: actionable.target,
    priority: 10
  });

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
