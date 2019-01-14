var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var lynched = game.getPlayerByIdentifier(params.target);
  var plaguebearer = game.getPlayerByIdentifier(actionable.from);

  if (lynched.role.alignment === "town") {

    plaguebearer.misc.mislynches_achieved++;

    if (plaguebearer.misc.mislynches_achieved >= 2) {

      var remainder = game.findAll(x => x.isAlive() && x.role.alignment === "town" && x.identifier !== lynched.identifier);

      for (var i = 0; i < remainder.length; i++) {
        game.silentKill(remainder[i], "executed", null, 2);
      };

    };

  };

};
