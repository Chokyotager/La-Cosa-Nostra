var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var zealot = game.getPlayerByIdentifier(actionable.from);

  if (!zealot.isAlive()) {
    return true;
  };

  if (!game.isDay()) {
    return true;
  };

  var praetors = game.findAll(x => x.role_identifier === "praetor");

  // Account for multiple praetors
  for (var i = 0; i < praetors.length; i++) {

    var praetor = praetors[i];
    var log = praetors.misc.find(x => x.interval = game.period - 1);

    if (!log) {
      continue;
    };

    if (log.successful) {
      game.addMessage(":exclamation: Praetor **" + praetor.getDisplayName() + "**'s conversion was successful.");
    } else {
      // Insert tracking

      var visit_log = game.actions.visit_log;
      var visitor_names = new Array();

      for (var i = 0; i < visit_log.length; i++) {
        if (visit_log[i].target === praetor.identifier) {
          // Target
          var visitor = game.getPlayerByIdentifier(visit_log[i].visitor);
          visitor_names.push("**" + visitor.getDisplayName() + "**");
        };
      };

      visitor_names.sort();

      if (visitor_names.length > 0) {
        game.addMessage(":exclamation: Praetor **" + praetor.getDisplayName() + "**'s conversion was unsuccessful. Last night, " + auxils.pettyFormat(visitor_names) + " visited the praetor.");
      } else {
        game.addMessage(":exclamation: Praetor **" + praetor.getDisplayName() + "**'s conversion was unsuccessful. Last night, nobody visited the praetor.");
      };

    };

  };

};
