var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var to = game.getPlayerByIdentifier(actionable.to);
  var from = game.getPlayerByIdentifier(actionable.from);

  /* No need to create a loop */
  game.actions.delete(x => x.from === actionable.to && x.identifier === "assassin/target_killed");

  var kidnapped = to.getStatus("kidnapped");

  if (!kidnapped) {
    // Deal unstoppable attack to target
    rs.prototypes.unstoppableAttack.reason = "slit in the neck by an __Assassin__";

    // Non-astral, shift broadcast forward
    rs.prototypes.unstoppableAttack(...arguments, false, 1);

  } else {

    game.addMessage(from, ":exclamation: You could not kill your target because they were abducted!");

  };

  // Destroy this instance
  return true;

};
