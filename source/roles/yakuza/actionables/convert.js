var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var yakuza = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Yakuza-convert"});

  // Change the role
  target.changeRole("pyromaniac");
  game.addMessage(target, ":exclamation: You have been converted to a __Pyromaniac__ by a __Yakuza__.");

  // Kill the yakuza
  rs.prototypes.unstoppableAttack.reason = "found having committed suicide from a __conversion__";
  rs.prototypes.unstoppableAttack({to: actionable.from, from: actionable.from}, game, params);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
