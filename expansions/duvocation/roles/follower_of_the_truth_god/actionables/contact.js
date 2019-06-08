var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "truth-god-investigation"});

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  // Add attribute
  target.addAttribute("investigation_contract", 3, {contractor: actionable.from});
  game.addMessage(target, ":exclamation: You have been contacted last night and given an investigation ability. You may choose who your contractor investigates tonight, but you will not receive the results.");

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
