var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);

  if (!from.misc.unstoppable_attacks) {

    // Kill all visitors

    rs.prototypes.basicAttack.reason = "murdered";
    var outcome = rs.prototypes.basicAttack(...arguments);

  } else {

    rs.prototypes.unstoppableAttack.reason = "murdered";
    var outcome = rs.prototypes.unstoppableAttack(...arguments);

    // Kill all visitors
    game.addAction("envoy_of_death/attack_visitors", ["retrovisit"], {
      from: actionable.from,
      to: actionable.to,
      expiry: 1
    });

  };

  if (!outcome) {

    var to = game.getPlayerByIdentifier(actionable.to);

    game.addMessage(from, ":exclamation: Your target could not be attacked last night!");

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
