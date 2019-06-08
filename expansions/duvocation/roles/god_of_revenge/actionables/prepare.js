var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Veteran seen as self-visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "GOR-prepare"});
    
  // Add killing action
  game.addAction("god_of_revenge/attacked", ["attacked"], {
    name: "Veteran-kill-visitors",
    expiry: 1,
    from: actionable.from,
    to: actionable.from,
    priority: 10
  });

  var user = game.getPlayerByIdentifier(actionable.from);

  user.misc.revenge_attack_preparations--;

};

module.exports.TAGS = ["roleblockable", "visit"];
