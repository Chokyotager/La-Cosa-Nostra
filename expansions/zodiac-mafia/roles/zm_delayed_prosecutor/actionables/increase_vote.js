var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // I'm not using expiry because some games
  // may not have a Day 0

  if (game.getPeriod() < 5) {
    return false;
  };

  var player = game.getPlayerByIdentifier(actionable.to);

  if (!player.isAlive()) {
    return true;
  };

  // Vote stats are summed
  player.setPermanentStat("vote-magnitude", 2, Math.max);

  game.addMessage(player, ":exclamation: The votes you cast in the trial now count as two.");

  return true;

};
