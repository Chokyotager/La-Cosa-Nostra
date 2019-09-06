var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  rs.prototypes.powerfulAttack.reason = "sacrificed by a __Cleric__";

  var target = game.getPlayerByIdentifier(actionable.to);

  if (target.role.role["alignment"] !== "Recruited Praetorium") {
    return null;
  };

  var outcome = rs.prototypes.powerfulAttack(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
