var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  rs.prototypes.unstoppableAttack.reason = "killed from lynching a __Joker__";

  rs.prototypes.unstoppableAttack(...arguments);

};
