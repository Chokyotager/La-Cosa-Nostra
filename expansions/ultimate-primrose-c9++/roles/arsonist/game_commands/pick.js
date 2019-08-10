var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  var choice = params[0].toLowerCase();

  var serial_killer = game.getPlayerById(message.author.id);

  if (!serial_killer.misc.can_pick) {
    message.channel.send(":x: You can no longer pick a perk!");
    return null;
  };

  if (!["bulletproof", "investigation"].includes(choice)) {
    message.channel.send(":x: Invalid choice. Choose either `bulletproof` for 1-shot BP or `investigation` for investigation immunity.");
    return null;
  };

  game.addAction("arsonist/pick", ["instant"], {
    name: "Arsonist-pick",
    expiry: 1,
    from: message.author.id,
    to: message.author.id,
    choice: choice
  });

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = false;
module.exports.DISALLOW_NIGHT = false;
