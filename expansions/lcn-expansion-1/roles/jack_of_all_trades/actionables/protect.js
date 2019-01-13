var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {
  rs.prototypes.powerfulDefense(...arguments);

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "JOAT-visit"});

  var from = game.getPlayerByIdentifier(actionable.from);
  var to = game.getPlayerByIdentifier(actionable.to);

  // Add message
  game.addAction("jack_of_all_trades/prot_message", ["attacked"], {
    name: "JOAT-prot-success-message",
    from: actionable.from,
    to: actionable.to,
    expiry: 1,
    priority: 10
  });

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
