var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  rs.prototypes.unstoppableAttack.reason = "haunted by a __Jester__";

  var jester = game.getPlayerByIdentifier(actionable.from);

  jester.misc.jester_haunted = true;

  // Astral
  var outcome = rs.prototypes.unstoppableAttack(...arguments, true);

  if (!outcome) {

    game.addMessage(jester, ":exclamation: Your target could not be haunted last night!");

  };

};

module.exports.TAGS = ["drivable"];
