var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  var player = game.getPlayerById(message.author.id);

  var blessings = player.attributes.filter(x => x.attribute.modular && x.attribute["modular-details"]["cluster"] === "blessing");

  blessings.sort((a, b) => a.tags.uses - b.tags.uses);

  if (blessings.length > 0) {

    blessings = blessings.map((x, i) => (i+1) + ". " + x.attribute.name + " [x " + x.tags.uses + "]");
    message.channel.send(":pray: You currently have the following blessings:\n```fix\n" + blessings.join("\n") + "\n```");

  } else {

    message.channel.send(":pray: You have no blessings left.");

  };

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = false;
module.exports.DISALLOW_NIGHT = false;
