var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  var visit_log = game.actions.visit_log;
  var visitor_names = new Array();

  for (var i = 0; i < visit_log.length; i++) {
    if (visit_log[i].target === actionable.to) {
      // Target
      var visitor = game.getPlayerByIdentifier(visit_log[i].visitor);

      if (rs.modular.hasModule(visitor, "Covert", "trait")) {
        continue;
      };

      visitor_names.push("**" + visitor.getDisplayName() + "**");
    };
  };

  var lookout = game.getPlayerByIdentifier(actionable.from);

  visitor_names.sort();

  if (visitor_names.length > 0) {
    var message = ":eye: " + auxils.pettyFormat(visitor_names) + " visited your target last night.";

    game.addMessage(lookout, message);
  } else {
    game.addMessage(lookout, ":eye: Nobody visited your target last night.");
  };

};
