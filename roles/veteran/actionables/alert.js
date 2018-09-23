var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  // Veteran seen as self-visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Veteran-self-visit"});

  // Increase immunity
  rs.prototypes.basicDefense(...arguments);

  // Add killing action
  game.addAction("veteran/kill_visitors", ["visit"], {
    name: "Veteran-kill-visitors",
    expiry: 1,
    from: actionable.from,
    to: actionable.from,
    priority: 10
  });

};

module.exports.TAGS = ["roleblockable", "visit"];
