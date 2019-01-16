var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var lynched = game.getPlayerByIdentifier(actionable.to);
  var pestilence = game.getPlayerByIdentifier(actionable.from);

  if (lynched.role.alignment === "town") {

    pestilence.misc.mislynches_achieved++;

    if (pestilence.misc.mislynches_achieved >= 2) {

      var remainder = game.findAll(x => x.isAlive() && x.role.alignment === "town");

      for (var i = 0; i < remainder.length; i++) {
        game.silentKill(remainder[i], "executed", null, 2);
      };

    };

  };

};
