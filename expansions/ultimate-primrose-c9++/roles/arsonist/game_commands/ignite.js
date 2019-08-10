// Register heal

var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  var from = game.getPlayerById(message.author.id);

  actions.delete(x => x.from === from.identifier && (x.identifier === "arsonist/douse" || x.identifier === "arsonist/ignite"));

  message.channel.send(":fire: You have decided to ignite tonight.");

  /*Ignition runs at a much higher priority
  - this is to allow Firefighter to possibly extinguish target
  first */

  game.addAction("arsonist/ignite", ["cycle"], {
    name: "Arsonist-ignition",
    expiry: 1,
    from: message.author.id,
    to: message.author.id,
    priority: 8
  });

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
