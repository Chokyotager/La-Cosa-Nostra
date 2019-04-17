var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.strongkills_left > 0) {

    player.game.sendPeriodPin(channel, ":no_entry: You may choose to kill a player tonight.\n\nUse `" + config["command-prefix"] + "kill <alphabet/name/nobody>` to select your target for a normal kill or `" + config["command-prefix"] + "strongkill <alphabet/name/nobody>` to use your strong kill.");

  } else {

    player.game.sendPeriodPin(channel, ":no_entry: You may choose to kill a player tonight.\n\nUse `" + config["command-prefix"] + "kill <alphabet/name/nobody>` to select your target.");

  };

  var abilities = player.attributes.filter(x => x.attribute.modular && x.attribute["modular-details"]["cluster"] === "ability");

  abilities.sort((a, b) => a.tags.uses - b.tags.uses);

  if (abilities.length > 0) {

    abilities = abilities.map((x, i) => (i+1) + ". " + x.attribute.name + " [x " + x.tags.uses + "]");
    player.game.sendPeriodPin(channel, ":exclamation: You currently have the following **non-passive** limited-use abilities:\n\n```fix\n" + abilities.join("\n") + "\n```\nYou may use an ability __in conjunction__ with the kill. To obtain information on an ability and how to use it (if applicable), use `!ability <power name>`.");

  } else {

    player.game.sendPeriodPin(channel, ":exclamation: You have no **non-passive** limited-use abilities left.\n\nTo obtain information on a specific ability, use `!ability <power name>`.");

  };


};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
