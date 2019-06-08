var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  var visit_log = game.actions.visit_log;

  var visited_names = new Array();
  var visitor_names = new Array();

  for (var i = 0; i < visit_log.length; i++) {
    if (visit_log[i].visitor === actionable.to) {
      // Target
      var visited = game.getPlayerByIdentifier(visit_log[i].target);
      visited_names.push("**" + visited.getDisplayName() + "**");
    };

    if (visit_log[i].target === actionable.to) {
      // Target
      var visitor = game.getPlayerByIdentifier(visit_log[i].visitor);
      visitor_names.push("**" + visitor.getDisplayName() + "**");
    };

  };

  var nightwatcher = game.getPlayerByIdentifier(actionable.from);

  visited_names.sort();
  visitor_names.sort();

  visits = visited_names.length > 0 ? visited_names : ["nobody"];
  visitors = visitor_names.length > 0 ? visitor_names : ["nobody"];

  var names = auxils.shuffle([auxils.choice(visits), auxils.choice(visitors)]);

  game.addMessage(nightwatcher, ":door: You sense the presences of " + auxils.pettyFormat(names) + ".");

};
