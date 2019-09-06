var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  var visit_log = game.actions.visit_log;
  var visited_names = new Array();

  for (var i = 0; i < visit_log.length; i++) {
    if (visit_log[i].visitor === actionable.to) {
      // Target
      var visited = game.getPlayerByIdentifier(visit_log[i].target);
      visited_names.push("**" + visited.getDisplayName() + "**");
    };
  };

  var tracker = game.getPlayerByIdentifier(actionable.from);

  visited_names.sort();

  if (visited_names.length > 0) {
    var message = ":mag: Your target visited " + auxils.pettyFormat(visited_names) + " last night.";

    game.addMessage(tracker, message);
  } else {
    game.addMessage(tracker, ":mag: Your target did not visit anybody last night.");
  };


};
