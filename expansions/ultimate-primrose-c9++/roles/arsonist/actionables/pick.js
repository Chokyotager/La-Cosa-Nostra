var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var choice = actionable.choice;

  var arsonist = game.getPlayerByIdentifier(actionable.from);

  var channel = arsonist.getPrivateChannel();

  switch (choice) {

    case "bulletproof":
      arsonist.addAttribute("protection", Infinity, {amount: 2});
      arsonist.misc.can_pick = false;
      channel.send(":exclamation: You have chosen the 2-shot bulletproof perk.");
      break;

    case "investigation":
      arsonist.setPermanentStat("detection-immunity", 1, "set");
      arsonist.misc.can_pick = false;
      channel.send(":exclamation: You have chosen the investigation immunity perk.");
      break;

    default:
      return true;

  };

  // Remove
  game.actions.delete(x => x.identifier === "arsonist/pick_expiry" && x.from === actionable.from);

  return true;

};
