var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var roleblocker = game.getPlayerByIdentifier(params.roleblocker);

  rs.prototypes.basicAttack.reason = "stabbed by a __Serial Killer__";

  var outcome = rs.prototypes.basicAttack({to: roleblocker.identifier, from: actionable.from}, game, params);

  if (!outcome) {
    var to = game.getPlayerByIdentifier(actionable.to);

    game.addMessage(from, ":exclamation: Your target could not be attacked last night!");

  };

  // Cancel all actions
  game.actions.delete(x => x.identifier === "serial_killer/attack" && x.from === actionable.from);

};
