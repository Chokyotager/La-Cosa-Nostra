var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);
  var mortician = game.getPlayerByIdentifier(actionable.from);

  // Target is killed for any reason
  mortician.misc.mortician_protections++;

  game.addMessage(mortician, ":exclamation: You have gained a protection!");

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
