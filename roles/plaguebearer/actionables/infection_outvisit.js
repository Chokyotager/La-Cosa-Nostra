var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(params.target);

  if (!target.misc.plague_infected) {

    game.addAction("plaguebearer/infection_spread", ["retrovisit"], {
      from: target,
      to: target,
      expiry: Infinity,
      execution: 2,
      tags: ["permanent", "infection"],
      priority: 10
    });

    game.addAction("plaguebearer/infection_outvisit", ["outvisit"], {
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
