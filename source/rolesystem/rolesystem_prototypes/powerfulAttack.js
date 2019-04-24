module.exports = function (actionable, game, params, astral=false, broadcast_offset=0) {

  var attacked = game.getPlayerByIdentifier(actionable.to);

  var attack_parameters = {attacker: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    strength: 2,
    astral: astral,
    reason: module.exports.reason,
    secondary_reason: module.exports.secondary_reason};

  game.execute("attacked", attack_parameters);

  if (!astral) {

    game.execute("visit", {visitor: actionable.from,
      target: actionable.to,
      priority: actionable.priority,
      reason: module.exports.reason,
      secondary_reason: module.exports.secondary_reason});
  };

  var stat = attacked.getStat("basic-defense", Math.max);

  if (stat < 2) {
    // Kill the player
    attack_parameters.type = "attack";
    game.kill(attacked, module.exports.reason, module.exports.secondary_reason, broadcast_offset, attack_parameters);
    return true;
  } else {
    return false;
  };

};

module.exports.reason = "killed";
module.exports.secondary_reason = undefined;
