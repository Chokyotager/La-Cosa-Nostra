var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Target was attacked
  var cleaned = game.getPlayerByIdentifier(actionable.to);
  var cleaner = game.getPlayerByIdentifier(actionable.from);

  cleaned.misc.role_cleaned = true;

  cleaned.setDisplayRole("Cleaned");

  cleaned.setPrecedentWill(null);

  var sendable = ":file_cabinet: **" + cleaned.getDisplayName() + "**'s role was **" + cleaned.getTrueFlavourRole() + "**.";

  cleaner.getPrivateChannel().send(sendable);

  return true;

};
