var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var veteran = game.getPlayerByIdentifier(actionable.from);
  var visitor = game.getPlayerByIdentifier(params.visitor);

  /* For some reason, if the veteran visits self after the
  alert action was sent, it should not go through */

  if (veteran.identifier === visitor.identifier) {
    return null;
  };

  // Deal basic attack to anyone
  rs.prototypes.basicAttack.reason = "shot by a __Veteran__";

  // Attack is astral
  var outcome = rs.prototypes.basicAttack({from: veteran.identifier, to: visitor.identifier}, game, params, true);

  if (!outcome) {
    game.addMessage(":exclamation: Someone visited you but they could not be attacked!");
  };

};
