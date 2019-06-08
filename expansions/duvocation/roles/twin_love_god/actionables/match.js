module.exports = function (actionable, game, params) {

  var one = game.getPlayerByIdentifier(actionable.to);
  var two = game.getPlayerByIdentifier(actionable.target);

  var matcher = game.getPlayerByIdentifier(actionable.from);
  var matcher_lover = game.getPlayerByIdentifier(matcher.misc.tlg_matched);
  
  // Cupid action is astral

  if (!one.isAlive() || !two.isAlive()) {
    return true;
  };

  // Match the players
  game.addAction("twin_love_god/matched_suicide", ["killed"], {
    from: one,
    to: two,
    matcher: matcher.identifier,
    expiry: Infinity,
    tags: ["permanent"]
  });

  game.addAction("twin_love_god/matched_suicide", ["killed"], {
    from: two,
    to: one,
    matcher: matcher.identifier,
    expiry: Infinity,
    tags: ["permanent"]
  });

  matcher.misc.matches_left--;
  matcher_lover.misc.matches_left--;

  one.getPrivateChannel().send(":two_hearts: You have been matched with **" + two.getDisplayName() + "**!");
  two.getPrivateChannel().send(":two_hearts: You have been matched with **" + one.getDisplayName() + "**!");

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
