var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  var praetor = game.getPlayerByIdentifier(actionable.from);

  var logged = praetor.misc.praetor_conversions.some(x => x.interval === game.period);

  if (logged) {

    return null;

  };

  // Add log
  praetor.misc.praetor_conversions.push({interval: game.period, successful: false, target: actionable.to});

};
