var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (game, message, params) {

  var actions = game.actions;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "extinguish <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);

  actions.delete(x => x.from === message.author.id && x.identifier === "firefighter/extinguish");

  if (to.score > 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":fire_engine: You have decided to extinguish nobody tonight.");
    return null;
  };

  to = to.player;

  if (to.id === message.author.id) {
    message.channel.send(":fire_engine: You have decided to extinguish **yourself** tonight.");
  } else {
    message.channel.send(":fire_engine: You have decided to extinguish **" + to.getDisplayName() + "** tonight.")
  };

  game.addAction("firefighter/extinguish", ["cycle"], {
    name: "Firefighter-extinguish",
    expiry: 1,
    from: message.author.id,
    to: to.id
  });

};
