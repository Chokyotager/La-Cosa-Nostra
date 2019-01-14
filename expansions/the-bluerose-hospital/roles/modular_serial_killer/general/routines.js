var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;
var attributes = lcn.attributes;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();
  var powers = player.attributes.filter(x => x.attribute.modular && x.attribute["modular-details"]["cluster"] === "power");

  powers.sort((a, b) => a.tags.uses - b.tags.uses);

  if (powers.length > 0) {
    powers = powers.map((x, i) => (i+1) + ". " + x.attribute.name + " [x " + x.tags.uses + "]");

    player.game.sendPeriodPin(channel, ":dvd: You currently have the following modular powers:\n\n```fix\n" + powers.join("\n") + "\n```\nYou may only use **one power per night**. To obtain information on a power and how to use it, use `!power <power name>`. `!power` lists all available powers.");
  } else {

    player.game.sendPeriodPin(channel, ":dvd: You have no modular powers left.\nTo obtain information on a specific power, use `!power <power name>`. `!power` lists all available powers.");

  };

  var kills = player.modular_success_log.filter(x => x === "power_rid_kill").length;

 channel.send(":knife: You still need **" + (2 - kills) + "** successful RID Kill" + auxils.vocab("s", (2 - kills)) + " to win this game.");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
