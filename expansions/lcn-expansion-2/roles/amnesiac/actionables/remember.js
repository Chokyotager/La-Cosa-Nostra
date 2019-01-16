var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);
  var amnesiac = game.getPlayerByIdentifier(actionable.from);

  // Switch role
  amnesiac.changeRole(target.role_identifier);

  var name = amnesiac.role["role-name"];

  game.addBroadcastSummary("An __Amnesiac__ has remembered the __" + name + "__ role.");
  game.addMessage(amnesiac, ":exclamation: You have remembered the **" + name + "** role.");

};

module.exports.TAGS = ["roleblockable", "visit"];
