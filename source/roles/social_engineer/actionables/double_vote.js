var rs = require("../../../rolesystem/rolesystem.js");
var auxils = require("../../../systems/auxils.js");

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);

  target.setGameStat("vote-magnitude", 2, auxils.operations.multiplication);

  return true;

};
