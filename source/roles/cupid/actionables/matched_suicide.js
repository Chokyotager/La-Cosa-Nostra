var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {
  // Suicide

  var from = game.getPlayerByIdentifier(actionable.from);
  var killed = game.getPlayerByIdentifier(actionable.to);

  /* Remove other lovers' suicide action,
  no need to create a loop */
  game.actions.delete(x => x.from === actionable.to && x.identifier === "cupid/matched_suicide");

  /* Downright kill - this attack is absolute
  and unpreventable by ANY role or action */

  // Set 1 to broadcast offset
  game.silentKill(from, "found dead, having committed suicide over the loss of their matched lover", "found dead, having committed suicide over the loss of your matched lover", 2);

  // Destroy this instance
  return true;

};
