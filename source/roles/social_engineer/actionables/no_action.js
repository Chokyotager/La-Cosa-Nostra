var rs = require("../../../rolesystem/rolesystem.js");
var auxils = require("../../../systems/auxils.js");

module.exports = function (actionable, game, params) {

  var social_engineer = game.getPlayerByIdentifier(actionable.from);

  social_engineer.misc.se_influence_log.unshift(null);

  return true;

};
