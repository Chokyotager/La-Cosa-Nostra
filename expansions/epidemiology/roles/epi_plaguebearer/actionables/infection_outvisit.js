var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(params.target);

  if (!target.misc.plague_infected) {

    game.addAction("epi_plaguebearer/infection_spread", ["retrovisit"], {
      from: target,
      to: target,
      expiry: Infinity,
      execution: 2,
      tags: ["permanent", "infection"],
      priority: 10
    });

    game.addAction("epi_plaguebearer/infection_outvisit", ["outvisit"], {
      from: target,
      to: target,
      expiry: Infinity,
      execution: 2,
      tags: ["permanent", "infection"],
      priority: 10
    });

    target.misc.plague_infected = true;
  };

};
