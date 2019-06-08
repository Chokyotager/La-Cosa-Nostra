var lcn = require("../../../../../source/lcn.js");

// Executes BEFORE introduction

var auxils = lcn.auxils;

module.exports = function (player) {

  // Find pair
  // If multiple available, shuffle

  var game = player.game;
  var config = game.config;

  player.addAttribute("mafia_factionkill");

  player.addAttribute("curse_restraint", Infinity, {uses: 2});
  player.addAttribute("curse_vigour", Infinity, {uses: 2});
  player.addAttribute("curse_security", Infinity, {uses: 2});
  player.addAttribute("curse_strongkill", Infinity, {uses: 1});

  player.game.addAction("4_faced_god/roleblocked", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.game.addAction("4_faced_god/arbiter_modifier", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  var channel = player.getPrivateChannel();

  var prefix = config["command-prefix"];

  player.addIntroMessage(":candle: This is a modular set-up. This is a directory for modular commands:\n\n:one: `" + prefix + "curse`: lists all available modular curses.\n:two: `" + prefix + "curse <curse name>`: provides the information associated with a modular curse.\n:three: `" + prefix + "listcurses`: lists all the curses you have at the time of execution. \n\nThese commands may only be run in your private channel.");

  // Scout of blessings
  var followers = game.findAll(x => x.isAlive() && x.role_identifier === "follower_of_3");

  // Hardcoded due to restraints
  var blessings_map = [
    {name: "Restraint (Roleblock)", count: followers.length},
    {name: "Vigor (Influence)", count: followers.length},
    {name: "Security (Protect)", count: followers.length}
  ];

  blessings_map.sort((a, b) => a.count - b.count);
  blessings_map = blessings_map.map((x, i) => (i+1) + ". " + x.name + " [x " + x.count + "]");

  player.addIntroMessage(":pray: You see that there are **" + followers.length + "** followers and they have the following blessings:\n\n```fix\n" + blessings_map.join("\n") + "\n```");


};
