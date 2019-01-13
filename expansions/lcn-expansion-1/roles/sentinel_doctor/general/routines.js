var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  var target = player.game.getPlayerByIdentifier(player.misc.sentinel_target);

  if (target && target.isAlive()) {

    player.game.sendPeriodPin(channel, ":pill: Your current target is **" + target.getDisplayName() + "**. You will repeatedly protect them until they die, in which case you may choose a new target.");

    player.game.addAction("sentinel_doctor/doc_protect", ["cycle"], {
      name: "Doc-protect",
      expiry: 1,
      from: player,
      to: target
    });

  } else {

    player.sentinel_target = null;

    player.game.sendPeriodPin(channel, ":pill: You may choose a player to repeatedly heal.\n\nUse `" + config["command-prefix"] + "heal <alphabet/name/nobody>` to select your target.\n\nYou may not reselect a target until your target is dead.");

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
