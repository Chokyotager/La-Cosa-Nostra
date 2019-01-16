var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  // Counted as visiting self
  game.execute("visit", {visitor: actionable.from,
    target: actionable.from,
    priority: actionable.priority,
    reason: "Assassin-pick-target"});

  var victim = game.getPlayerByIdentifier(actionable.to);
  var assassin = game.getPlayerByIdentifier(actionable.from);

  // If Assassin is killed
  game.addAction("assassin/assassination", ["killed"], {
    name: "Assassin-pick-target",
    expiry: Infinity,
    from: actionable.from,
    to: actionable.to,
    target: actionable.from,
    tags: ["permanent"]
  });

  // If target is killed
  game.addAction("assassin/target_killed", ["killed"], {
    name: "Assassin-target-killed",
    expiry: Infinity,
    from: actionable.to,
    to: actionable.from,
    target: actionable.to,
    tags: ["permanent"]
  });

  assassin.misc.assassin_picked_target = true;
  assassin.misc.assassin_target = actionable.to;

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
