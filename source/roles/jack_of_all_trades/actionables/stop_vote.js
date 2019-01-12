var rs = require("../../../rolesystem/rolesystem.js");
var auxils = require("../../../systems/auxils.js");

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);
  var from = game.getPlayerByIdentifier(actionable.from);

  target.setGameStat("vote-magnitude", 0, "set");

  return true;

};
