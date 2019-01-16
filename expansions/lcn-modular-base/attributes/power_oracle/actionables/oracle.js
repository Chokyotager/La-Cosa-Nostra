var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  game.addAction("a/power_oracle/reveal", ["killed"], {
    name: "Modular-oracle",
    expiry: 1,
    from: actionable.from,
    to: actionable.from,
    priority: 20,
    reveal_target: actionable.to
  });

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable"];
