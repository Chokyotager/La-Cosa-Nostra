var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (player) {

  var config = player.game.config;

  var channel = player.getPrivateChannel();

  var prefix = config["command-prefix"];

  player.addIntroMessage(":zap: This is a modular set-up. This is a directory for modular commands:\n\n:one: `" + prefix + "power`: lists all available modular powers.\n:two: `" + prefix + "power <power name>`: provides the information associated with a modular power.\n:three: `" + prefix + "listpowers`: lists all the powers you have at the time of execution. May only be run in your private channel.");

  player.game.addAction("modular_copy_machine/remove_on_win", ["cycle"], {
    name: "Modular-CopyMachine-remove-on-win",
    expiry: Infinity,
    from: player,
    to: player,
    priority: 100,
    tags: ["permanent"]
  });

  player.game.addAction("modular_copy_machine/success", ["miscellaneous"], {
    name: "Modular-CopyMachine-success",
    expiry: Infinity,
    from: player,
    to: player,
    tags: ["permanent"]
  });

  rs.modular.predefineLogs(player);

};
