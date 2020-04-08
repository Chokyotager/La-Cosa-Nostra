module.exports = function (player) {

  if (!player.game.actions.exists(x => x.identifier === "a/invincibility/attacked" && x.from === player.identifier)) {

    // Add attacked primer
    player.game.addAction("a/invincibility/attacked", ["attacked"], {
      name: "Invincibility-primer",
      from: player,
      to: player,
      expiry: Infinity,
      priority: 1,
      tags: ["permanent"]
    });

  };

  player.setGameStat("basic-defense", 4, Math.max);

};
