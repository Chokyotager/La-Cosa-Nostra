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
      // Roleblock and detection immunity
      envoy.setPermanentStat("roleblock-immunity", 1, "set");
      envoy.setPermanentStat("detection-immunity", 1, "set");
      game.addMessage(envoy, ":exclamation: You have gained roleblock and detection immunity!");
      break;

    case 2:
      rs.modular.addModule(envoy, "strongkill");
      game.addMessage(envoy, ":exclamation: You have gained an unstoppable attack!");
      break;

    case 3:
      rs.modular.addModule(envoy, "strongkill", Infinity);
      envoy.misc.astral_attacks = true;
      game.addMessage(envoy, ":exclamation: You have gained an infinite number of unstoppable attacks!");
      break;

  };

};
