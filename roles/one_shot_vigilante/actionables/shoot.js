var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  rs.prototypes.powerfulAttack.reason = "shot by a __Vigilante__";

  var outcome = rs.prototypes.powerfulAttack(...arguments);

  var from = game.getPlayerByIdentifier(actionable.from);
  from.misc.vigilante_bullets--;

  if (!outcome) {
    var to = game.getPlayerByIdentifier(actionable.to);

    game.addMessage(from, ":exclamation: Your target could not be attacked last night!");

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
