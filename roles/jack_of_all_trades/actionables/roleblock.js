module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);
  var roleblocker = game.getPlayerByIdentifier(actionable.from);

  // Considered as visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "JOAT-visit"});

  game.execute("roleblock", {roleblocker: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "JOAT-roleblock"});

  var immunity = target.getStat("roleblock-immunity", Math.max);

  if (immunity < 1) {
    // Delete all
    game.actions.delete(x => x.from === target.identifier && x.tags.includes("roleblockable"));
    game.addMessage(target, ":exclamation: You were roleblocked last night!");

    target.setStatus("roleblocked", true);

    game.addMessage(roleblocker, ":exclamation: You successfully executed your action!");
    roleblocker.misc.joat_actions_left--;

  } else {

    game.addMessage(target, ":exclamation: Someone tried roleblocking you last night but you could not be roleblocked!");
    //game.addMessage(roleblocker, ":exclamation: Your target could not be roleblocked last night!");

  };

  game.addAction("jack_of_all_trades/remove_on_win", ["cycle"], {
    name: "JOAT-remove-on-win",
    expiry: 1,
    from: actionable.from,
    to: actionable.to
  });

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
