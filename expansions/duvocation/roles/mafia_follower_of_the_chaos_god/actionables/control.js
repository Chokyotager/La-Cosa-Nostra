var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Counted as visiting
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "MFOC-control"});

  var drivables = game.actions.findAll(x => x.tags.includes("drivable") && x.from === actionable.to);

  for (var i = 0; i < drivables.length; i++) {
    drivables[i].to = actionable.target;
  };

  var target = game.getPlayerByIdentifier(actionable.to);

  if (drivables.length > 0) {

    game.addMessage(target, ":exclamation: You come home confused about what you did last night.");

  };

};

module.exports.TAGS = ["roleblockable", "visit"];
