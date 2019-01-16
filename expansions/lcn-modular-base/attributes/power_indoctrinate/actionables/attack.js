var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  rs.prototypes.basicAttack.reason = "killed by indoctrination";

  var outcome = rs.prototypes.basicAttack(...arguments);

  var from = game.getPlayerByIdentifier(actionable.from);

  game.addMessage(from, ":exclamation: You have attacked your target by indoctrination as you already have a mentee.");

  if (!outcome) {

    var to = game.getPlayerByIdentifier(actionable.to);

    game.addMessage(from, ":exclamation: Your target could not be attacked last night!");

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
