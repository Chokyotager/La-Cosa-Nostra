var lcn = require("../../../../../source/lcn.js");

// Executes BEFORE introduction

var auxils = lcn.auxils;

module.exports = function (player) {

  // Find pair
  // If multiple available, shuffle

  var game = player.game;
  var config = game.config;

  player.addAttribute("mafia_factionkill");

  player.addIntroMessage(":exclamation: You sense the presence of another Follower of the Chaos God, and they seem to bear malice towards everyone.");

};
