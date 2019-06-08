var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  var exclusion = ["god_of_war/kill", "a/mafia_factionkill", "follower_of_the_chaos_god/kill", "god_of_beasts/kill"];

  var actions = game.actions.findAll(x => x.to === actionable.from && !x.tags.includes("permanent") && !exclusion.includes(x.identifier));

  var players = new Array();

  for (var i = 0; i < actions.length; i++) {

    // Set roleblocked
    players.push(actions[i].from);

  };

  var unique = auxils.getUniqueArray(players);

  for (var i = 0; i < unique.length; i++) {

    game.execute("roleblock", {roleblocker: actionable.from,
      target: unique[i],
      priority: actionable.priority,
      reason: "Unknown-god-roleblock"});

    game.getPlayerByIdentifier(unique[i]).setStatus("roleblocked", true);

  };

  game.actions.delete(x => x.to === actionable.from && !x.tags.includes("permanent") && !exclusion.includes(x.identifier));

};
