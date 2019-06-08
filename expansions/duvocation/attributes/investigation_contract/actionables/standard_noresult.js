var lcn = require("../../../../../source/lcn.js");

module.exports = function (actionable, game, params) {

  var player = game.getPlayerByIdentifier(actionable.from);

  var contractor = game.getPlayerByIdentifier(player.attributes.find(x => x.identifier === "investigation_contract").tags.contractor);

  game.addMessage(contractor, ":mag: You got __No Result__.");

};
