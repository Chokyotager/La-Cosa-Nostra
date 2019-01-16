module.exports = function (actionable, game, params, notify=true) {

  var target = game.getPlayerByIdentifier(actionable.to);

  // Seen as visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority});

  // Stops all actions to the target that are roleblockable
  var actions = game.actions.findAll(x => (x.to === actionable.to || x.to === actionable.target) && x.tags.includes("roleblockable") && !x.tags.includes("permanent") && x.execution <= 0);

  if (notify) {
    for (var i = 0; i < actions.length; i++) {
      // Inform of failure

      var action = actions[i];

      var affected = game.getPlayerByIdentifier(action.from);

      game.addMessage(affected, ":exclamation: Your action failed because your target was " + module.exports.reason + "!");

    };
  };

  game.actions.delete(x => (x.to === actionable.to || x.to === actionable.target) && x.tags.includes("roleblockable") && !x.tags.includes("permanent") && x.execution <= 0);

  return true;

};

module.exports.reason = "away";
