var lcn = require("../../../../../source/lcn.js");

var auxils = lcn.auxils;

// Executes BEFORE introduction

module.exports = function (player) {

  player.misc.charms_left = 5;

  player.game.addAction("follower_of_the_god_of_prosperity/arbiter_modifier", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.addIntroMessage(":four_leaf_clover: You now have **" + player.misc.charms_left + "** charm" + auxils.vocab("s", player.misc.charms_left) + ".");

};
