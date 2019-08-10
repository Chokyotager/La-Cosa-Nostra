var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var choice = actionable.choice;

  var serial_killer = game.getPlayerByIdentifier(actionable.from);

  var channel = serial_killer.getPrivateChannel();

  switch (choice) {

    case "bulletproof":
      serial_killer.addAttribute("protection", Infinity, {amount: 2});
      serial_killer.misc.can_pick = false;
      channel.send(":exclamation: You have chosen the 2-shot bulletproof perk.");
      break;

    case "investigation":
      serial_killer.setPermanentStat("detection-immunity", 1, "set");
      serial_killer.misc.can_pick = false;
      channel.send(":exclamation: You have chosen the investigation immunity perk.");
      break;

    default:
      return true;

  };

  // Remove
  game.actions.delete(x => x.identifier === "serial_killer/pick_expiry" && x.from === actionable.from);

  return true;

};
