var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var executable = lcn.executable;

module.exports = function (actionable, game, params) {

  // Check if any primaries are left

  // Check Mafia with PID
  var player = game.getPlayerByIdentifier(actionable.from);

  if (!player.isAlive()) {
    return true;
  };

  if (game.find(hasPID)) {
    return false;
  };

  // Check
  var no_pid = game.findAll(doesNotHavePID);

  var has_power_inspect = no_pid.filter(x => hasPower(x, "Power Inspect", "Infinity"));
  var cult = no_pid.filter(x => x.role.alignment !== "cult");

  if (player.role.alignment === "cult" && no_pid.length < cult.length) {
    return false;
  };

  if (hasPower(player, "Power Inspect", "Infinity") && no_pid.length > has_power_inspect.length) {
    return false;
  };

  if (!hasPower(player, "PID Kill")) {
    player.addAttribute("power_pid_kill", Infinity, {uses: "Infinity"});
  } else {
    player.attributes.find(x => x.identifier === "power_pid_kill").tags.uses = "Infinity";
  };

  var addendum = new String();

  if (!rs.modular.hasModule(player, "Power Manipulation Immunity", "trait")) {
    player.addAttribute("trait_power_manipulation_immunity", Infinity);
    addendum = " You have also obtained the Power Manipulation Immunity trait.";
  };

  game.addMessage(player, ":exclamation: You have obtained infinite uses of the PID Kill power as no members of the Mafia carry it." + addendum);

  return true;

  function hasPID (player) {

    var role_idenitifer = player.initial_role_identifier[0];

    var role = executable.roles.getRole(role_idenitifer);

    var is_mafia = role.alignment === "mafia";
    var is_alive = player.isAlive();
    var has_pid = hasPower(player, "PID Kill", "Infinity");

    return is_mafia && is_alive && has_pid;

  };

  function doesNotHavePID (player) {

    var role_idenitifer = player.initial_role_identifier[0];

    var role = executable.roles.getRole(role_idenitifer);

    var is_mafia = role.alignment === "mafia";
    var is_alive = player.isAlive();
    var has_pid = hasPower(player, "PID Kill", "Infinity");

    return is_mafia && is_alive && !has_pid;

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
