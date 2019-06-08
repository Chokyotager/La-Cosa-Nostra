module.exports = function (actionable, game, params) {

  game.addAction("god_of_revenge/kill_visitors", ["retrovisit"], {
    name: "Veteran-kill-visitors",
    expiry: 1,
    from: actionable.from,
    to: actionable.from,
    priority: 10
  });

  var user = game.getPlayerByIdentifier(actionable.from);
  game.addMessage(user, ":exclamation: You were attacked last night!");

  return true;

};
