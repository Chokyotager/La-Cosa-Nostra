var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Doctor-visit"});

  var target = game.getPlayerByIdentifier(actionable.to);
  var from = game.getPlayerByIdentifier(actionable.from);

  /*
  target.misc.protections ? target.misc.protections++ : target.misc.protections = 1;

  // Add message
  game.addAction("doctor/single_protection", ["attacked"], {
    name: "Doc-single-protection",
    from: actionable.from,
    to: actionable.to,
    expiry: 1,
    priority: 1
  });*/

  target.addAttribute("protection", 1, {amount: 1});

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
