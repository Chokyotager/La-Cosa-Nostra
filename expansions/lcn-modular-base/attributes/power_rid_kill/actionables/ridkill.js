var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  var to = game.getPlayerByIdentifier(actionable.to);
  var from = game.getPlayerByIdentifier(actionable.from);

  var guess = actionable.guess;
  var true_role = to.getTrueFlavourRole(false);

  // Check RID
  var dist = auxils.levenshteinDistance(guess.toLowerCase(), true_role.toLowerCase());

  var metric = (dist)/true_role.length;
  metric = -Math.abs(metric) + 1;

  rs.modular.attributeDecrement(...arguments);

  if (metric < 0.6) {
    game.addMessage(from, ":exclamation: The RID failed.");
    return null;
  };

  game.addMessage(from, ":exclamation: The RID succeeded.");

  rs.prototypes.basicAttack.reason = "RID killed";

  var outcome = rs.prototypes.basicAttack(...arguments);

  if (outcome) {

    rs.modular.logSuccess(...arguments);

  } else {

    game.addMessage(from, ":exclamation: Your target could not be attacked last night!");

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
