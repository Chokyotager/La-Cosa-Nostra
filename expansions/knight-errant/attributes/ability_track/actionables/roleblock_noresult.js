var lcn = require("../../../../../source/lcn.js");

module.exports = function (actionable, game, params) {

  var player = game.getPlayerByIdentifier(actionable.from);

  // Check if exists
  var watching = game.actions.exists(x => x.from === player.identifier && x.identifier === "a/ability_track/watch");
  var previously_roleblocked = player.getStatus("roleblocked");

  if (watching && !previously_roleblocked) {
    game.addMessage(player, ":mag: You got __No Result__.");
  };

};
