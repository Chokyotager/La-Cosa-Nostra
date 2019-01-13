var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);

  if (target.hasAttribute("power_kill")) {

    target.attributes.find(x => x.identifier === "power_kill").tags.uses++;

  } else {

    target.addAttribute("power_kill", Infinity, {uses: 1});

  };

  game.addMessage(target, ":exclamation: You have been delivered a 1x Kill power.");

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
