var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Bodyguard-guard"});

    var target = game.getPlayerByIdentifier(actionable.to);
    var from = game.getPlayerByIdentifier(actionable.from);

    target.addAttribute("protection", 1, {amount: 1});

    game.addAction("bodyguard/target_attacked", ["attacked"], {
      name: "Bodyguard-guard-attacked",
      expiry: 1,
      from: actionable.from,
      to: actionable.to
    });

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
