module.exports = function (actionable, game, params, astral=false, broadcast_offset=0) {

  var attacked = game.getPlayerByIdentifier(actionable.to);

  game.execute("attacked", {attacker: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    strength: 3,
    reason: module.exports.reason,
    secondary_reason: module.exports.secondary_reason});

  if (!astral) {

    game.execute("visit", {visitor: actionable.from,
      target: actionable.to,
      priority: actionable.priority,
      reason: module.exports.reason,
      secondary_reason: module.exports.secondary_reason});
  };

  var stat = attacked.getStat("basic-defense", Math.max);

  if (stat < 3) {
    // Kill the player
    game.kill(attacked, module.exports.reason, module.exports.secondary_reason, broadcast_offset);
    return true;
  } else {
    return false;
  };

};

module.exports.reason = "killed";
module.exports.secondary_reason = undefined;
