var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  rs.prototypes.powerfulDefense(...arguments);

  var target = game.getPlayerByIdentifier(actionable.to);

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Doctor-visit"});

  target.misc.doc_protections ? target.misc.doc_protections++ : target.misc.doc_protections = 1;

  // Add message
  game.addAction("doctor/single_protection", ["attacked"], {
    name: "Doc-single-protection",
    from: actionable.from,
    to: actionable.to,
    expiry: 1,
    priority: 1
  });

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
