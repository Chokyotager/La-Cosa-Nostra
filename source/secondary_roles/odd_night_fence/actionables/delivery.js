var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  // Send visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Odd-night-Fence-visit"});

  var recipient = game.getPlayerByIdentifier(actionable.to);
  var sender = game.getPlayerByIdentifier(actionable.from);

  game.addMessage(recipient, ":exclamation: You have received a gun from an anonymous person. The gun may be shot during the day. It will expire if it is not used before tonight.");

  recipient.addAttribute("fence_gun", 2);

  sender.misc.fence_log.push(recipient.identifier);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
