var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var self = game.getPlayerByIdentifier(actionable.from);

  if (params.circumstances.type !== "attack") {
    return false;
  };

  if (game.isDay()) {
    return false;
  };

  if (!self.misc.blood_wrought_killed) {

    self.misc.blood_wrought_killed = true;
    game.addMessage(self, ":exclamation: You successfully got yourself killed!");

    game.addAction("blood_wrought/remove_killed_action", ["postcycle"], {
      name: "Blood-wrought-remove-killed-action",
      expiry: 1,
      execution: 1,
      from: actionable.from,
      to: actionable.to,
      priority: 2
    });

  };

  var attacker = game.getPlayerByIdentifier(params.circumstances.attacker);

  game.addAction("blood_wrought/further_disable_message", ["cycle"], {
    name: "Blood-wrought-disable",
    expiry: 2,
    execution: 2,
    from: actionable.from,
    to: attacker.identifier,
    priority: 2
  });

  game.addAction("blood_wrought/further_disable", ["cycle"], {
    name: "BLood-wrought-disable",
    expiry: 3,
    execution: 3,
    from: actionable.from,
    to: attacker.identifier,
    priority: 0.000001
  });

  game.addMessage(attacker, ":exclamation: You have been disabled! You may not use any action the next night.");

};
