var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  // Check that target visited prot

  if (params.visitor !== actionable.attack) {
    return null;
  };

  rs.prototypes.powerfulAttack.reason = "sniped by a __Marksman__";

  var outcome = rs.prototypes.powerfulAttack({to: actionable.attack, from: actionable.from}, game, params, false, 1);

  var from = game.getPlayerByIdentifier(actionable.from);

  if (!outcome) {

    game.addMessage(from, ":exclamation: Your target visited your protégé but could not be attacked last night!");

  } else {

    game.addMessage(from, ":exclamation: Your protégé was visited by your target last night!");

  };

  return true;

};
