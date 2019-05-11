var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  game.addAction("plaguebearer/infect_plague", ["retrocycle"], {
    from: actionable.from,
    to: params.target,
    expiry: 1,
    tags: ["permanent"],
    priority: 10
  });

};
