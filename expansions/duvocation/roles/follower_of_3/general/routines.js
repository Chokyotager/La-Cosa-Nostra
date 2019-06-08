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
  var blessings = player.attributes.filter(x => x.attribute.modular && x.attribute["modular-details"]["cluster"] === "blessing");

  blessings.sort((a, b) => a.tags.uses - b.tags.uses);

  if (blessings.length > 0) {
    blessings = blessings.map((x, i) => (i+1) + ". " + x.attribute.name + " [x " + x.tags.uses + "]");

    player.game.sendPeriodPin(channel, ":pray: You currently have the following blessings:\n\n```fix\n" + blessings.join("\n") + "\n```\nYou may only use **one blessing per night**. To obtain information on a blessing and how to use it, use `!blessing <blessing name>`.");
  } else {

    player.game.sendPeriodPin(channel, ":pray: You have no blessings left.");

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
