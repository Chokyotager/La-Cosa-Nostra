var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Janitor-clean"});

  game.addAction("janitor/clean_role", ["killed"], {
    name: "Janitor-clean-role",
    expiry: 2,
    from: actionable.from,
    to: actionable.to,
    attack: actionable.target,
    priority: 4
  });

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
