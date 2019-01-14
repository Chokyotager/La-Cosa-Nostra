var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);

  if (from.role_identifier !== "modular_copy_machine") {
    return true;
  };

  if (params.event === "modular_log_decrement" && params.module !== "power_power_copy") {

    game.addMessage(from, ":exclamation: You successfully executed your action.");

  };

};
