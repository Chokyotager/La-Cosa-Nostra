var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  rs.prototypes.powerfulDefense(...arguments);

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Modular-visit"});

  if (actionable.from !== actionable.to) {
    game.addAction("a/power_guard/defend", ["attacked"], {
      name: "Modular-guard-defend",
      expiry: 1,
      from: actionable.from,
      to: actionable.to
    });
  };

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
