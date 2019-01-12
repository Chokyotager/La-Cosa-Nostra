var rs = require("../../../rolesystem/rolesystem.js");
var auxils = require("../../../systems/auxils.js");

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  game.addAction("a/power_power_census/gather", ["cycle"], {
    name: "Modular-gather",
    expiry: 1,
    from: actionable.from,
    to: actionable.to,
    census: actionable.census,
    priority: 16
  });

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["roleblockable"];
