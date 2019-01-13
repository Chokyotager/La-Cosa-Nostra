var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var executable = lcn.executable;

module.exports = function (actionable, game, params) {

  // Check if any primaries are left

  // Check Mafia with Power Inspect
  var player = game.getPlayerByIdentifier(actionable.from);

  if (!player.isAlive()) {
    return true;
  };

  if (game.find(hasPowerInspect)) {
    return false;
  };

  // Check
  var no_power_inspect = game.findAll(doesNotHavePowerInspect);

  var has_pid_kill = no_power_inspect.filter(x => hasPower(x, "PID Kill", "Infinity"));
  var cult = no_power_inspect.filter(x => x.role.alignment !== "cult");

  if (player.role.alignment === "cult" && no_power_inspect.length < cult.length) {
    return false;
  };

  if (hasPower(player, "PID Kill", "Infinity") && no_power_inspect.length > has_pid_kill.length) {
    return false;
  };

  if (!hasPower(player, "Power Inspect")) {
    player.addAttribute("power_power_inspect", Infinity, {uses: "Infinity"});
  } else {
    player.attributes.find(x => x.identifier === "power_power_inspect").tags.uses = "Infinity";
  };

  var addendum = new String();

  if (!rs.modular.hasModule(player, "Power Manipulation Immunity", "trait")) {
    player.addAttribute("trait_power_manipulation_immunity", Infinity);
    addendum = " You have also obtained the Power Manipulation Immunity trait.";
  };

  game.addMessage(player, ":exclamation: You have obtained infinite uses of the Power Inspect power as no members of the Mafia carry it." + addendum);

  return true;

  function hasPowerInspect (player) {

    var role_idenitifer = player.initial_role_identifier[0];

    var role = executable.roles.getRole(role_idenitifer);

    var is_mafia = role.alignment === "mafia";
    var is_alive = player.isAlive();
    var has_power_inspect = hasPower(player, "Power Inspect", "Infinity");

    return is_mafia && is_alive && has_power_inspect;

  };

  function doesNotHavePowerInspect (player) {

    var role_idenitifer = player.initial_role_identifier[0];

    var role = executable.roles.getRole(role_idenitifer);

    var is_mafia = role.alignment === "mafia";
    var is_alive = player.isAlive();
    var has_power_inspect = hasPower(player, "Power Inspect", "Infinity");

    return is_mafia && is_alive && !has_power_inspect;

  };

  function hasPower (player, power, uses) {

    var attributes = player.attributes;

    if (uses) {
      return attributes.some(x => x.attribute.modular && x.attribute.name.toLowerCase() === power.toLowerCase() && x.attribute["modular-details"]["cluster"].toLowerCase() === "power" && x.tags.uses === uses);
    } else {
      return attributes.some(x => x.attribute.modular && x.attribute.name.toLowerCase() === power.toLowerCase() && x.attribute["modular-details"]["cluster"].toLowerCase() === "power");
    };

  };

};
