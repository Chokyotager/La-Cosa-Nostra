var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  game.actions.delete(x => x.identifier === "a/power_crosshair/attack" && x.from === actionable.from);

  game.addAction("a/power_crosshair/attack", ["killed"], {
    name: "Modular-attack",
    expiry: Infinity,
    from: actionable.from,
    to: actionable.from,
    crosshair_target: actionable.crosshair_target,
    priority: 5,
    tags: ["permanent"]
  });

};
