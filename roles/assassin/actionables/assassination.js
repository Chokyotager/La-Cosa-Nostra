var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var to = game.getPlayerByIdentifier(actionable.to);

  /* Remove other lovers' suicide action,
  no need to create a loop */
  game.actions.delete(x => x.from === actionable.to && x.identifier === "assassin/target_killed");

  // Deal unstoppable attack to target
  rs.prototypes.unstoppableAttack.reason = "slit in the neck by an __Assassin__";

  // Non-astral, shift broadcast forward
  rs.prototypes.unstoppableAttack(...arguments, false, 1);

  // Destroy this instance
  return true;

};
