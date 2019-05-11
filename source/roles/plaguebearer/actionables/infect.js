var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  // Send visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Plaguebearer-visit"});

  var target = game.getPlayerByIdentifier(actionable.to);

  game.addAction("plaguebearer/infect_plague", ["retrocycle"], {
    from: actionable.from,
    to: target,
    expiry: 1,
    tags: ["permanent"],
    priority: 10
  });

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
