var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);
  var mortician = game.getPlayerByIdentifier(actionable.from);

  // Considered as visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Mortician-visit"});

  game.addAction("mortician/target_killed", ["killed"], {
    name: "Mortician-target-killed",
    from: actionable.from,
    to: actionable.to,
    target: actionable.to,
    expiry: 1,
    priority: 10
  });

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
