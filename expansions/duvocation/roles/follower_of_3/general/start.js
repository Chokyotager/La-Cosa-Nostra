var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;
var attributes = lcn.attributes;

module.exports = function (player) {

  var config = player.game.config;

  player.addAttribute("blessing_restraint", Infinity, {uses: 1});
  player.addAttribute("blessing_vigour", Infinity, {uses: 1});
  player.addAttribute("blessing_security", Infinity, {uses: 1});

  player.game.addAction("follower_of_3/roleblocked", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  var channel = player.getPrivateChannel();

  var prefix = config["command-prefix"];

  player.addIntroMessage(":pray: This is a modular set-up. This is a directory for modular commands:\n\n:one: `" + prefix + "blessing`: lists all available modular blessings.\n:two: `" + prefix + "blessing <blessing name>`: provides the information associated with a modular blessing.\n:three: `" + prefix + "listblessings`: lists all the blessings you have at the time of execution.\n\nThese commands may only be run in your private channel.");

};
