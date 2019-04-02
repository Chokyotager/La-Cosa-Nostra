var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Remove protection
  var target = game.getPlayerByIdentifier(actionable.from);

  if (target.misc.protections > 1) {

    target.misc.protections--;

  } else {

    target.setGameStat("basic-defense", 0, "set");

  };

};
