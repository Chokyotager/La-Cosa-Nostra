var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  var player = game.getPlayerById(message.author.id);

  var powers = player.attributes.filter(x => x.attribute.modular && x.attribute["modular-details"]["cluster"] === "power");

  powers.sort((a, b) => a.tags.uses - b.tags.uses);

  if (powers.length > 0) {

    powers = powers.map((x, i) => (i+1) + ". " + x.attribute.name + " [x " + x.tags.uses + "]");
    message.channel.send(":zap: Your current modular powers:\n```fix\n" + powers.join("\n") + "\n```");

  } else {

    message.channel.send(":zap: You currently do not have any modular powers.");

  };

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = false;
module.exports.DISALLOW_NIGHT = false;
