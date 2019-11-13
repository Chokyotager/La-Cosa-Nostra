var lcn = require("../../../../../source/lcn.js");

module.exports = function (actionable, game, params) {

  var player = game.getPlayerByIdentifier(actionable.from);

  // Check if exists
  var investigating = game.actions.exists(x => x.from === player.identifier && x.identifier === "two_shot_cop/investigate");
  var previously_roleblocked = player.getStatus("roleblocked");

  if (investigating && !previously_roleblocked) {
    game.addMessage(player, ":mag: You got __No Result__.");

    from.misc.investigations_left--;
  };

};
