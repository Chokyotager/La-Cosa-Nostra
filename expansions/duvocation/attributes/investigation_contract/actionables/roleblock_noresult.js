var lcn = require("../../../../../source/lcn.js");

module.exports = function (actionable, game, params) {

  var player = game.getPlayerByIdentifier(actionable.from);

  var contractor = game.getPlayerByIdentifier(player.attributes.find(x => x.identifier === "investigation_contract").tags.contractor);

  // Check if exists
  var investigating = game.actions.exists(x => x.from === player.identifier && x.identifier === "a/investigation_contract/investigate");
  var previously_roleblocked = player.getStatus("roleblocked");

  if (investigating && !previously_roleblocked) {
    game.addMessage(contractor, ":mag: You got __No Result__.");
  };

};
