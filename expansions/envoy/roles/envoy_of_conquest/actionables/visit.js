var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Counted as visiting
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "EOC-control"});

  var drivables = game.actions.findAll(x => x.tags.includes("drivable") && x.from === actionable.to);

  var redirect_target = rs.choice(game.findAll(x => x.isAlive()));

  for (var i = 0; i < drivables.length; i++) {
    drivables[i].to = redirect_target.identifier;
  };

  var target = game.getPlayerByIdentifier(actionable.to);

  rs.prototypes.basicAttack({from: actionable.to, to: redirect_target.identifier, priority: actionable.priority}, game, params, true);

  if (drivables.length > 0) {

    game.addMessage(target, ":exclamation: You were controlled last night.");

  };

};

module.exports.TAGS = ["roleblockable", "visit"];
