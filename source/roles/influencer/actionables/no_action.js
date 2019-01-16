var rs = require("../../../rolesystem/rolesystem.js");
var auxils = require("../../../systems/auxils.js");

module.exports = function (actionable, game, params) {

  var influencer = game.getPlayerByIdentifier(actionable.from);

  influencer.misc.influencer_log.unshift(null);

  return true;

};
