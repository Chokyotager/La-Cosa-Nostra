var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var lynched = game.getPlayerByIdentifier(params.target);
  var plaguebearer = game.getPlayerByIdentifier(actionable.from);

  if (lynched.role.alignment === "town") {

    plaguebearer.misc.mislynches_achieved++;

    if (plaguebearer.misc.mislynches_achieved >= 2) {

      var remainder = game.findAll(x => x.isAlive() && x.role.alignment === "town" && x.identifier !== lynched.identifier);

      for (var i = 0; i < remainder.length; i++) {
        game.kill(remainder[i], "destroyed by __Pestilence__", null, 2);
      };

    };

  };

};
