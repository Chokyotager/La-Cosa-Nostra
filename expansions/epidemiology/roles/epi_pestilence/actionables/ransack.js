var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  rs.prototypes.powerfulAttack.reason = "destroyed by __Pestilence__";

  var outcome = rs.prototypes.powerfulAttack(...arguments);

  var from = game.getPlayerByIdentifier(actionable.from);

  if (!outcome) {

    var to = game.getPlayerByIdentifier(actionable.to);

    game.addMessage(from, ":exclamation: Your target could not be attacked last night!");

  };

  game.addAction("epi_pestilence/attack_visitors", ["retrovisit"], {
    from: actionable.from,
    to: actionable.to,
    expiry: 1
  });

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
