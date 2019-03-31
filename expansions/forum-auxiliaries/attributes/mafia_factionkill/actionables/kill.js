var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  rs.prototypes.basicAttack(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
