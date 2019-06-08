var lcn = require("../../../../../source/lcn.js");

// Executes BEFORE introduction

var auxils = lcn.auxils;

module.exports = function (player) {

  // Find pair
  // If multiple available, shuffle

  var game = player.game;
  var config = game.config;

  player.addAttribute("mafia_factionkill");

  // Check if already matched
  if (player.misc.tlg_matched) {

    game.addAction("twin_love_god/suicide", ["killed"], {
      from: player,
      to: player.misc.tlg_matched,
      expiry: Infinity,
      tags: ["permanent"]
    });

    var lover = game.getPlayerByIdentifier(player.misc.tlg_matched);
    player.addIntroMessage(":revolving_hearts: You are in love with **" + lover.getDisplayName() + "**.");
    return null;

  };

  var others = game.findAll(x => x.role_identifier === "twin_love_god" && x.isAlive() && x.identifier !== player.identifier && x.misc.tlg_matched === undefined);

  // Downright throw an error if there is no match
  if (others.length < 1) {
    var err = new Error("There should be an even number of Twin Love Gods in the game!");
    throw err;
  };

  var matched = auxils.cryptographicChoice(others);

  // Set chat initiator
  player.misc.tlg_initiator = true;

  // Cross the properties
  player.misc.tlg_matched = matched.identifier;
  matched.misc.tlg_matched = player.identifier;

  player.misc.matches_left = 1;
  matched.misc.matches_left = 1;

  game.addAction("twin_love_god/suicide", ["killed"], {
    from: player,
    to: player.misc.tlg_matched,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.addIntroMessage(":revolving_hearts: You are in love with **" + matched.getDisplayName() + "**.");

};
