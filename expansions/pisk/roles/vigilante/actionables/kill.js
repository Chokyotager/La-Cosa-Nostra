var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var outcome = rs.prototypes.basicAttack(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
