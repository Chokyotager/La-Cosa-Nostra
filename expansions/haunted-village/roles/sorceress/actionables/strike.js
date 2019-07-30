var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  rs.prototypes.powerfulAttack.reason = "struck by a bolt of lightning summoned by a __Sorceress__";

  var outcome = rs.prototypes.powerfulAttack(...arguments);

  var from = game.getPlayerByIdentifier(actionable.from);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
