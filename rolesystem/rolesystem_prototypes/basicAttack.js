module.exports = function (actionable, game, params) {

  var attacked = game.getPlayerByIdentifier(actionable.to);

  game.execute("attacked", {attacker: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    strength: 1,
    reason: module.exports.reason,
    secondary_reason: module.exports.secondary_reason});

  var stat = attacked.getStat("basic-defense", Math.max);

  if (stat < 1) {
    // Kill the player
    game.kill(attacked, module.exports.reason, module.exports.secondary_reason);
    return true;
  } else {
    return false;
  };

};

module.exports.reason = "killed";
module.exports.secondary_reason = undefined;
