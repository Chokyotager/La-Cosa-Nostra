var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Astral move
  var drivables_1 = game.actions.findAll(x => x.tags.includes("drivable") && x.to === actionable.to);
  var drivables_2 = game.actions.findAll(x => x.tags.includes("drivable") && x.to === actionable.target);
  
  for (var i = 0; i < drivables_1.length; i++) {
    drivables_1[i].to = actionable.target;
  };

  for (var i = 0; i < drivables_2.length; i++) {
    drivables_2[i].to = actionable.to;
  };

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["roleblockable", "visit"];
