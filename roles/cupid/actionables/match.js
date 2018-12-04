module.exports = function (actionable, game, params) {

  var one = game.getPlayerByIdentifier(actionable.to);
  var two = game.getPlayerByIdentifier(actionable.target);
  var matcher = game.getPlayerByIdentifier(actionable.from);

  // Cupid action is astral

  // Match the players
  game.addAction("cupid/matched_suicide", ["killed"], {
    from: one,
    to: two,
    matcher: matcher.identifier,
    expiry: Infinity,
    tags: ["permanent"]
  });

  game.addAction("cupid/matched_suicide", ["killed"], {
    from: two,
    to: one,
    matcher: matcher.identifier,
    expiry: Infinity,
    tags: ["permanent"]
  });

  game.addAction("cupid/matched_lock_chats_on_death", ["killed"], {
    from: one,
    to: two,
    matcher: matcher.identifier,
    expiry: Infinity,
    tags: ["permanent"]
  });

  game.addAction("cupid/matched_lock_chats_on_death", ["killed"], {
    from: two,
    to: one,
    matcher: matcher.identifier,
    expiry: Infinity,
    tags: ["permanent"]
  });

  // Mediator
  game.addAction("cupid/chat_mediator", ["postcycle"], {
    from: one,
    to: two,
    matcher: matcher.identifier,
    expiry: Infinity,
    tags: ["permanent"]
  });

  game.addAction("cupid/chat_mediator", ["postcycle"], {
    from: two,
    to: one,
    matcher: matcher.identifier,
    expiry: Infinity,
    tags: ["permanent"]
  });

  matcher.misc.cupid_matches--;

  one.getPrivateChannel().send(":hearts: You have been matched with **" + two.getDisplayName() + "**!");
  two.getPrivateChannel().send(":hearts: You have been matched with **" + one.getDisplayName() + "**!");

  createChannels();

  async function createChannels () {

    var read_perms = game.config["base-perms"]["read"];

    var channel_name = "matched-" + one.alphabet + "-" + two.alphabet;

    var channel = await game.createPrivateChannel(channel_name, [
      {target: one.getDiscordUser(), permissions: read_perms},
      {target: two.getDiscordUser(), permissions: read_perms}
    ]);

    await channel.send("**This is the matched lovers' chat.**\n\nThis chat is open to both parties only at night.");

    one.misc.matched_lover_channel = channel.id;
    one.misc.matched_lover_initiator = true;
    two.misc.matched_lover_channel = channel.id;

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
