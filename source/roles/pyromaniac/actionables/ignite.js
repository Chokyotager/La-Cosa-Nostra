var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  // Self-visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Pyromaniac-ignition"});

  // Get all ignited players
  var doused = game.findAll(x => x.misc.doused === true && x.isAlive());

  for (var i = 0; i < doused.length; i++) {

    rs.prototypes.unstoppableAttack.reason = "annihilated in a fire set by a member of the __Mafia__";
    var outcome = rs.prototypes.unstoppableAttack({to: doused[i].identifier, from: actionable.from, tags:["astral"]}, game, params, true);

    if (!outcome) {
      game.addMessage(from, ":exclamation: " + doused[i].getDisplayName() + " survived the fire!");
    };

  };


};

module.exports.TAGS = ["roleblockable", "visit"];
