var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);
  var roleblocker = game.getPlayerByIdentifier(actionable.from);

  // Considered as visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Modular-visit"});

  game.execute("roleblock", {roleblocker: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Modular-roleblock"});

  var immunity = target.getStat("roleblock-immunity", Math.max);

  if (immunity < 1) {
    // Delete all
    game.actions.delete(x => x.from === target.identifier && x.tags.includes("roleblockable"));

    target.setStatus("roleblocked", true);

  };

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "visit"];
