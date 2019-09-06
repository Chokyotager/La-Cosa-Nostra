var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Recruit to emissary
  var recruit = game.getPlayerByIdentifier(actionable.to);
  var emissary = game.getPlayerByIdentifier(actionable.from);

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Emissary-visit"});

  if (recruited.role.alignment !== "praetorium") {
    return null;
  };

  // Recruit the player
  emissary.misc.emissary_players.push(recruit.identifier);

  var channel = game.getChannelById(emissary.misc.emissary_channel);

  recruit.addSpecialChannel(channel);

  game.addMessage(recruit, ":exclamation: You have imparted into an Emissary chat by **" + emissary.getDisplayName() + "**.");

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
