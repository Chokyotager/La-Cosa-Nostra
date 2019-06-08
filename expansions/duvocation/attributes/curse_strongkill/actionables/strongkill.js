var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  var outcome = rs.prototypes.unstoppableAttack(...arguments);

  var from = game.getPlayerByIdentifier(actionable.from);

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["visit"];
