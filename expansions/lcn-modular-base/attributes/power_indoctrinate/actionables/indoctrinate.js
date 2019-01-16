var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Recruit to neighbourhood
  var mentor = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  var mentee = game.getPlayerByIdentifier(mentor.misc.cult_member);

  if (mentee && mentee.isAlive()) {

    // Deal a fatal attack
    game.addAction("a/power_indoctrinate/attack", ["cycle"], {
      from: mentor.identifier,
      to: target.identifier,
      expiry: 1,
      priority: 5
    });

  } else {

    // Recruit the player
    game.addAction("a/power_indoctrinate/recruit", ["cycle"], {
      from: mentor.identifier,
      to: target.identifier,
      expiry: 1,
      priority: 8
    });

  };

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
