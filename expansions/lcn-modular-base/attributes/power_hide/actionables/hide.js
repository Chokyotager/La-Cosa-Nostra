var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);

  // Hide
  rs.prototypes.basicHide.reason = "not available";
  rs.prototypes.basicHide(...arguments);

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["roleblockable", "visit"];
