var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;
var auxils = lcn.auxils;
var attributes = lcn.attributes;

var usable_powers = Object.values(attributes).filter(x => x.attribute.modular && x.attribute["modular-details"]["cluster"] === "power");

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params.length < 1) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "pidkill <alphabet/username/nobody> [power1],[power2]...` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  var guess = params.splice(1, Infinity).join(" ").split(",").map(x => x.trim()).filter(x => x.length > 0);

  rs.modular.clearModuleActions(game, from.identifier, "power");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":bow_and_arrow: You have decided not to PID kill anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot PID kill a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot PID kill yourself!" + rs.misc.sarcasm(true));
    return null;

  };

  for (var i = 0; i < guess.length; i++) {

    var available = usable_powers.some(x => x.attribute.name.toLowerCase() === guess[i].toLowerCase());

    if (!available) {
      message.channel.send(":x: The power `" + guess[i] + "` does not exist!")
      return null;
    };

  };

  game.addAction("a/power_pid_kill/pidkill", ["cycle"], {
    name: "Modular-pidkill",
    expiry: 1,
    priority: 5,
    from: message.author.id,
    meta: {type: "power"},
    to: to.id,
    guess: guess
  });

  var mention = to.getDisplayName();

  if (guess.length > 0) {
    var concat = "the power list guess of: " + auxils.pettyFormat(guess.map(x => "`" + x + "`")) + ".";
  } else {
    var concat = "an empty power list.";
  };

  message.channel.send(":bow_and_arrow: You have decided to PID kill **" + mention + "** tonight with " + concat);

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
