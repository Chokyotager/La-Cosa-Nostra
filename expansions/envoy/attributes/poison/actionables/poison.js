var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  var poisoned = game.getPlayerByIdentifier(actionable.to);
  var poisoner = game.getPlayerByIdentifier(actionable.from);

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Attribute-poison-poison"});

  game.addAction("a/poison/poison_kill", ["cycle"], {
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

module.exports.TAGS = ["visit"];
