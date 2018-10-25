var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var lynched = game.getPlayerByIdentifier(actionable.to);
  var pestilence = game.getPlayerByIdentifier(actionable.from);

  if (lynched.role.alignment === "town") {

    pestilence.misc.mislynches_achieved++;

    if (pestilence.misc.mislynches_achieved >= 2) {

      var remainder = game.findAll(x => x.isAlive() && x.role.alignment === "town");

      for (var i = 0; i < remainder.length; i++) {
        game.kill(remainder[i], "destroyed by __Pestilence__", null, 2);
      };

    };

  };

};
