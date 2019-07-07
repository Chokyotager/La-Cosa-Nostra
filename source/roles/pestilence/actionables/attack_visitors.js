var rs = require("../../../rolesystem/rolesystem.js");

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  if (params.visitor !== actionable.from) {
    rs.prototypes.powerfulAttack.reason = "destroyed by __Pestilence__";

    // Astral
    var outcome = rs.prototypes.powerfulAttack({from: actionable.from, to: params.visitor, priority: actionable.priority}, game, params, true);
  };

};
