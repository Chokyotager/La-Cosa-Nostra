var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Considered as visit to player driven to
  game.execute("visit", {visitor: actionable.from,
    target: actionable.from,
    reason: "Modular-visit"});

  var drivables = game.actions.findAll(x => x.tags.includes("drivable") && x.to === actionable.to);

  for (var i = 0; i < drivables.length; i++) {
    drivables[i].to = actionable.target;
  };

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["roleblockable", "visit"];
