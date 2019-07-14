var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var envoy = game.getPlayerByIdentifier(actionable.from);

  if (!envoy.isAlive()) {
    return true;
  };

  var envoys_dead = game.findAll(x => !x.isAlive() && x.role.alignment === "envoy").length;

  if (envoys_dead <= envoy.promotion_status) {
    return false;
  };

  // Promote
  envoy.promotion_status = envoys_dead;

  switch (envoy.promotion_status) {

    case 1:
      envoy.setPermanentStat("roleblock-immunity", 1, "set");
      game.addMessage(envoy, ":exclamation: You have gained roleblock immunity!");
      break;

    case 2:
      rs.modular.addModule(envoy, "kill");
      game.addMessage(envoy, ":exclamation: You have gained a basic attack!");
      break;

    case 3:
      envoy.misc.control_attack_targets = true;
      rs.modular.addModule(envoy, "strongkill", Infinity);
      game.addMessage(envoy, ":exclamation: You have gained an unlimited number of unstoppable attacks! Your targets now deal a basic attack to those that they visit!");
      break;

  };

};
