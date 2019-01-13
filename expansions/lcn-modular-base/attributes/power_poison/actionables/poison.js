var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var poisoned = game.getPlayerByIdentifier(actionable.to);
  var poisoner = game.getPlayerByIdentifier(actionable.from);

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Modular-visit"});

  game.addAction("a/power_poison/poison_kill", ["cycle"], {
    name: "Poison-kill",
    expiry: 3,
    execution: 3,
    from: actionable.from,
    to: actionable.to,
    attack: actionable.target,
    priority: 4,
    tags: ["poison"]
  });

  game.addMessage(poisoned, ":exclamation: You were poisoned last night! You will die from the poison if you are not cured before tomorrow.");

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
