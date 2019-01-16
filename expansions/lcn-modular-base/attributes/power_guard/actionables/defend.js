var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var attacker = game.getPlayerByIdentifier(params.attacker);
  var guard = game.getPlayerByIdentifier(actionable.from);
  var protected = game.getPlayerByIdentifier(actionable.to);

  var strength = params.strength;

  // Do not guard unstoppables
  if (strength >= 3) {
    return null;
  };

  game.addMessage(guard, ":exclamation: The target you were guarding was attacked.");
  game.addMessage(attacker, ":exclamation: You attacked a guard on your target instead.");

  var tier = ["basicAttack", "powerfulAttack", "unstoppableAttack"][strength - 1];

  rs.prototypes[tier].reason = params.reason;
  rs.prototypes[tier].secondary_reason = params.secondary_reason;

  // Astral
  var outcome = rs.prototypes[tier]({to: actionable.from, from: params.attacker, priority: params.priority}, game, params, true);

  var from = game.getPlayerByIdentifier(actionable.from);

  if (!outcome) {

    var to = game.getPlayerByIdentifier(actionable.to);
    game.addMessage(attacker, ":exclamation: The guard protecting your target could not be attacked last night!");

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
