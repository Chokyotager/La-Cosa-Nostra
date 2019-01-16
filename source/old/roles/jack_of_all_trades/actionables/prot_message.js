module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);
  var to = game.getPlayerByIdentifier(actionable.to);

  game.addMessage(from, ":exclamation: Your target was attacked last night!");
  game.addMessage(to, ":exclamation: You were attacked last night but someone protected you!");

  if (params.strength <= 2) {
    game.addMessage(from, ":exclamation: You successfully executed your action!");
    from.misc.joat_actions_left--;
  };

  game.addAction("jack_of_all_trades/remove_on_win", ["cycle"], {
    name: "JOAT-remove-on-win",
    expiry: 1,
    from: actionable.from,
    to: actionable.to
  });

  // Do not destroy, ought there be more attacks
  return false;

};
