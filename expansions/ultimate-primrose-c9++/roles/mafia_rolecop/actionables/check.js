var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Rolecop-investigation"});

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  // Enumerate
  switch (target.role_identifier) {

    case "cop":
      var display_role = "Cop";
      break;

    case "neapolitan":
      var display_role = "Neapolitan";
      break;

    case "rolecop":
      var display_role = "Rolecop";
      break;

    case "mafia_rolecop":
      var display_role = "Rolecop";
      break;

    case "mafia_goon":
      var display_role = "Vanilla";
      break;

    case "vanilla_townie":
      var display_role = "Vanilla";
      break;

    case "tracker":
      var display_role = "Tracker";
      break;

    case "roleblocker":
      var display_role = "Roleblocker";
      break;

    case "mafia_roleblocker":
      var display_role = "Roleblocker";
      break;

    case "jailkeeper":
      var display_role = "Jailkeeper";
      break;

    default:
      var display_role = "Unknown";
      break;

  };

  var response = ":mag: Your target is a __" + display_role + "__.";

  game.addMessage(from, response);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
