var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Recruit to neighbourhood
  var recruit = game.getPlayerByIdentifier(actionable.to);
  var neighbour = game.getPlayerByIdentifier(actionable.from);

  // Recruit the player
  neighbour.misc.neighbour_players.push(recruit.identifier);

  game.addAction("a/power_inquisit/lock_neighbour_chat_on_death", ["killed"], {
    from: neighbour.identifier,
    to: recruit.identifier,
    expiry: Infinity,
    tags: ["permanent"]
  });

  game.addMessage(recruit, ":exclamation: You have recruited into a neighbourhood by **" + neighbour.getDisplayName() + "**.");

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
