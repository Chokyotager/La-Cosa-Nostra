var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  rs.prototypes.basicAttack.reason = "murdered";

  var outcome = rs.prototypes.basicAttack(...arguments);

  var from = game.getPlayerByIdentifier(actionable.from);

  if (!outcome) {

    var to = game.getPlayerByIdentifier(actionable.to);

    game.addMessage(from, ":exclamation: Your target could not be attacked last night!");

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
