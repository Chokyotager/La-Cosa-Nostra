var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  // Target was attacked
  var cleaned = game.getPlayerByIdentifier(actionable.to);
  var cleaner = game.getPlayerByIdentifier(actionable.from);

  cleaned.misc.role_cleaned = true;

  cleaned.setDisplayRole("Cleaned");

  cleaned.setPrecedentWill(null);

  var sendable = ":file_cabinet: **" + cleaned.getDisplayName() + "**'s role was **" + cleaned.getTrueFlavourRole() + "**.\n\n{;will}";

  var will = cleaned.getTrueWill();

  sendable = sendable.replace(new RegExp("{;will}", "g"), will ? "You recovered a last will:\n```fix\n" + will + "```" : "*You did not recover a will.*");

  cleaner.getPrivateChannel().send(sendable);



  cleaner.misc.janitor_cleans_left--;

  return true;

};
