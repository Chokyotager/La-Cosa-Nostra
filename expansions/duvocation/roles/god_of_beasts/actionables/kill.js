var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var night_chance = Math.floor(Math.random() * 10);

  var from = game.getPlayerByIdentifier(actionable.from);

  if (night_chance > from.misc.failure_chance) {

    var outcome = rs.prototypes.basicAttack(...arguments);

    if (!outcome) {

      from.misc.failure_chance += 1;
      game.addMessage(from, ":exclamation: The animal you sent out came home hungry!");

    };

  } else {

    from.misc.failure_chance += 1;
    game.addMessage(from, ":exclamation: The animal you sent out came home hungry!");

  };


};

module.exports.TAGS = ["drivable", "roleblockable", "visit", "lethal"];
