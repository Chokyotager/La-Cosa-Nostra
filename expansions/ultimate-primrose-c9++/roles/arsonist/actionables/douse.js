var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Arsonist-douse"});

  var doused = game.getPlayerByIdentifier(actionable.to);

  doused.misc.doused = true;

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
