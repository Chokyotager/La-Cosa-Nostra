var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var outcome = rs.prototypes.powerfulAttack(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
