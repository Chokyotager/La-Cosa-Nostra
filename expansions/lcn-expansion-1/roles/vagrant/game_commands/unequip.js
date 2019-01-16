var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  var from = game.getPlayerById(message.author.id);

  if (from.misc.vagrant_vest_uses < 1 || from.misc.vagrant_vest_shot) {
    message.channel.send(":x: You may not equip your vest again!");
    return null;
  };

  var equipped_vest = actions.exists(x => x.from === from.identifier && x.identifier === "vagrant/vest");

  if (!equipped_vest) {
    message.channel.send(":x: You are currently not equipping your bulletproof vest for tonight! Use `" + config["command-prefix"] + "equip` to do otherwise!");
    return null;
  };

  message.channel.send(":shield: You have decided not to equip your bulletproof vest tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
