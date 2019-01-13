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

  var count = new Number();
  var attributes = to.attributes.filter(x => x.attribute.modular && x.attribute["modular-details"]["cluster"] === "power");

  // Check PID
  for (var i = 0; i < guess.length; i++) {
    var has_attribute = attributes.some(x => x.attribute["name"].toLowerCase() === guess[i].toLowerCase());
    if (has_attribute) {
      count++;
    };
  };

  if (attributes.length > 0) {
    var metric = (guess.length - count)/attributes.length;
    metric = -Math.abs(metric) + 1;
  } else {
    var metric = (guess.length > attributes.length) ? 0 : 1;
  };

  if (metric < 0.6) {
    game.addMessage(from, ":exclamation: The PID failed.");
    return null;
  };

  game.addMessage(from, ":exclamation: The PID succeeded.");

  rs.prototypes.basicAttack.reason = "PID killed";

  var outcome = rs.prototypes.basicAttack(...arguments);

  if (outcome) {

    rs.modular.logSuccess(...arguments);

  } else {

    game.addMessage(from, ":exclamation: Your target could not be attacked last night!");

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
