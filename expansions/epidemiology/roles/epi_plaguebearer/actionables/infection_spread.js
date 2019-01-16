var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var visitor = game.getPlayerByIdentifier(params.visitor);

  if (!visitor.misc.plague_infected) {

    game.addAction("epi_plaguebearer/infection_spread", ["retrovisit"], {
      from: visitor,
      to: visitor,
      expiry: Infinity,
      execution: 2,
      tags: ["permanent", "infection"],
      priority: 10
    });

    game.addAction("epi_plaguebearer/infection_outvisit", ["outvisit"], {
      from: visitor,
      to: visitor,
      expiry: Infinity,
      execution: 2,
      tags: ["permanent", "infection"],
      priority: 10
    });

    visitor.misc.plague_infected = true;
  };

};
