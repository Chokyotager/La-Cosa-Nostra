var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {
  // Suicide==

  // Remove assassination
  game.actions.delete(x => x.to === actionable.to && x.identifier === "assassin/assassination");

  player.misc.assassin_picked_target = false;
  player.misc.assassin_target = null;

  // Destroy this instance
  return true;

};
