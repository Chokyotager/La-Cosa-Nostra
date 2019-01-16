var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var doctor = game.getPlayerByIdentifier(actionable.from);

  doctor.misc.protect_log.unshift(null);

  return true;

};
