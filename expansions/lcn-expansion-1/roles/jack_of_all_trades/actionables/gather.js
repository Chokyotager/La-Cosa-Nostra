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

  visits = visited_names.length > 0 ? auxils.pettyFormat(visited_names) : "nobody";
  visitors = visitor_names.length > 0 ? auxils.pettyFormat(visitor_names) : "nobody";

  if (visitors.length > 1) {
    game.addMessage(nightwatcher, ":exclamation: You successfully executed your action!");
    nightwatcher.misc.joat_actions_left--;
  };

  game.addMessage(nightwatcher, ":eye: Your target visited " + visits + " and was visited by " + visitors + " last night.");

  game.addAction("jack_of_all_trades/remove_on_win", ["cycle"], {
    name: "JOAT-remove-on-win",
    expiry: 1,
    from: actionable.from,
    to: actionable.to
  });

};
