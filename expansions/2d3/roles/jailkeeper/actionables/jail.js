var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);
  var alien = game.getPlayerByIdentifier(actionable.from);

  rs.prototypes.basicKidnap.reason = "abducted";
  var outcome =rs.prototypes.basicKidnap(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
