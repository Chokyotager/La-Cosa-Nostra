var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  rs.prototypes.basicAttack.reason = "superkilled";

  var outcome = rs.prototypes.unstoppableAttack(...arguments);

  var from = game.getPlayerByIdentifier(actionable.from);

  if (!outcome) {

    var to = game.getPlayerByIdentifier(actionable.to);

    game.addMessage(from, ":exclamation: Your target could not be attacked last night!");

  };

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["visit"];
