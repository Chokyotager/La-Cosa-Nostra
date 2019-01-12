var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  rs.prototypes.basicAttack.reason = "stabbed by a __Serial Killer__";

  var outcome = rs.prototypes.basicAttack(...arguments);

  if (!outcome) {
    var from = game.getPlayerByIdentifier(actionable.from);
    var to = game.getPlayerByIdentifier(actionable.to);

    game.addMessage(from, ":exclamation: Your target could not be attacked last night!");

  };

};

// Traits are compared with the stats before executing
module.exports.TAGS = ["drivable", "roleblockable", "visit"];
