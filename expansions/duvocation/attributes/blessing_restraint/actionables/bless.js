var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  // Check blessings for individual and delete
  var blessings = game.actions.delete(x => (x.identifier === "a/blessing_restraint/bless" && x.to === actionable.to));

  if (blessings.length > 1) {

    // Use the blessing
    game.addAction("a/blessing_restraint/roleblock", ["cycle"], {
      name: "Modular-roleblock-blessing",
      priority: 1,
      expiry: 2,
      from: actionable.from,
      to: actionable.to
    });

  };

  for (var i = 0; i < blessings.length; i++) {

    // Seen as a visit
    game.execute("visit", {visitor: blessings[i].from,
      target: blessings[i].to,
      priority: blessings[i].priority,
      reason: "Modular-visit"});

    rs.modular.attributeDecrement(blessings[i], game, params);

  };

};

module.exports.TAGS = ["drivable", "visit"];
