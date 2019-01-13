var lcn = require("../../../../../source/lcn.js");

var auxils = lcn.auxils;
var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var attacked = game.getPlayerByIdentifier(actionable.from);

  // add pre-prot stat, same for Vagrant

  var defense = attacked.getStat("basic-defense", Math.max);
  if (defense >= 2 && !attacked.misc.mortician_protection_online) {
    return null;
  };

  if (attacked.misc.mortician_protections > 0) {

    attacked.setGameStat("basic-defense", 2, Math.max);

    rs.protocol.attacked.NIGHT_MESSAGE = "attacked last night but you had a protection";
    rs.protocol.attacked.DAY_MESSAGE = "attacked but you had a protection";

    rs.protocol.attacked(...arguments);

    attacked.misc.mortician_protections--;
    attacked.misc.mortician_protection_online = true;

  } else {

    attacked.setGameStat("basic-defense", 0, "set");

  };

};
