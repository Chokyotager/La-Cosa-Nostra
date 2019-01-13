var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  game.addAction("a/power_pid_kill/kill", ["cycle"], {
    name: "Modular-pidkill-kill",
    expiry: 1,
    priority: 10,
    from: actionable.from,
    to: actionable.to,
    guess: actionable.guess
  });

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
