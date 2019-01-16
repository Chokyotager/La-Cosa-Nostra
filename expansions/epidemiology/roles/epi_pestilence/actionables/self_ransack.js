var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  rs.prototypes.basicAttack.reason = "destroyed by __Pestilence__";

  game.addAction("epi_pestilence/attack_visitors", ["retrovisit"], {
    from: actionable.from,
    to: actionable.to,
    expiry: 1
  });

};

module.exports.TAGS = ["roleblockable", "visit"];
