var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var vigilante = game.getPlayerByIdentifier(actionable.from);

  var outcome = rs.prototypes.basicAttack(...arguments);

  vigilante.misc.kills_left--;

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
