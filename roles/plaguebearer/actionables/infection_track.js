var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  // Check if XK roles left
  var all_infected = !game.exists(x => !x.misc.plague_infected && x.isAlive());

  if (!all_infected) {
    return null;
  };

  // Promote the player to Mafioso
  var player = game.getPlayerByIdentifier(actionable.to);

  if (!player.isAlive()) {
    return true;
  };

  player.changeRole("pestilence");
  game.addMessage(player, ":exclamation: You are now __Pestilence__, Horseman of the Apocalypse!");

  game.addBroadcastSummary("Disease sweeps the Town, and __Pestilence__, **Horseman of the Apocalypse**, has appeared.");

  return true;

};
