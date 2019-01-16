var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  var census = actionable.census;

  var psychic = game.getPlayerByIdentifier(actionable.from);

  var count = new Number();

  // Get all alive players
  var players = game.findAll(x => x.isAlive());

  for (var i = 0; i < players.length; i++) {
    var powers = players[i].attributes.filter(x => x.attribute.modular && x.attribute["modular-details"]["cluster"] === "power");
    var available = powers.filter(x => x.attribute.name.toLowerCase() === census.toLowerCase());

    for (var j = 0; j < available.length; j++) {

      if (available[j].tags.uses === "Infinity") {
        count = Infinity;
        continue;
      };

      count += available[j].tags.uses;
    };

  };

  if (count === Infinity) {
    count = "infinite";
  };

  game.addMessage(psychic, ":mag: The power `" + census + "` has **" + count + "** use" + auxils.vocab("s", count) + " remaining as at the end of the night.");

};
