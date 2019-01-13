var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var attorney = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  game.addAction("a/power_attorney/defend", ["postcycle"], {
    name: "Modular-defend",
    expiry: 2,
    from: actionable.from,
    to: actionable.to
  });

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
