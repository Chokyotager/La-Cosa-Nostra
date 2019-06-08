module.exports = function (game) {

  if (!game.isDay()) {
    return null;
  };

  if (!game.arbiter_god_alive) {
    return null;
  };

  game.addSpecialVoteType("arbiter_god", "Arbiter God", "⚖", true);

  game.addAction("g/votes/arbiter_god_vote", ["vote"], {
    expiry: 1,
    target: "s/arbiter_god",
    tags: ["system"]
  });

  game.addAction("g/votes/arbiter_god_unvote", ["unvote"], {
    expiry: 1,
    target: "s/arbiter_god",
    tags: ["system"]
  });

};
