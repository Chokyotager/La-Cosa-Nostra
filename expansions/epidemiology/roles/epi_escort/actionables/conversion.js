var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var escort = game.getPlayerByIdentifier(actionable.from);

  var have_unvisited = game.exists(x => x.isAlive() && !escort.misc.visit_log.includes(x.identifier) && x.identifier !== escort.identifier);

  if (!have_unvisited) {
    player.changeRole("compulsive_visitor");
    game.addMessage(player, ":exclamation: You are now a __Compulsive Visitor__.");
    return true;
  };

};
