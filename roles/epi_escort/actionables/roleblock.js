module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);
  var roleblocker = game.getPlayerByIdentifier(actionable.from);

  // Considered as visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Escort-visit"});

  game.execute("roleblock", {roleblocker: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Escort-roleblock"});

  var immunity = target.getStat("roleblock-immunity", Math.max);

  if (target.role_identifier === "epi_plaguebearer" && !target.getStatus("roleblocked")) {
    // Announce
    game.addBroadcastSummary("The __Plaguebearer__ was roleblocked last night.");
  };

  if (immunity < 1) {
    // Delete all
    game.actions.delete(x => x.from === target.identifier && x.tags.includes("roleblockable"));

    if (target.role_identifier === "epi_plaguebearer" || target.role_identifier === "epi_pestilence") {
      game.addMessage(target, ":exclamation: You were roleblocked last night!");
    };

    target.setStatus("roleblocked", true);

  } else {

    if (target.role_identifier === "epi_plaguebearer" || target.role_identifier === "epi_pestilence") {
      game.addMessage(target, ":exclamation: Someone tried roleblocking you last night but you could not be roleblocked!");
    };
    
    //game.addMessage(roleblocker, ":exclamation: Your target could not be roleblocked last night!");

  };

  roleblocker.misc.visit_log.push(target.identifier);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
