module.exports = function (player) {

  if (!player.game.actions.exists(x => x.identifier === "a/protection/attacked" && x.from === player.identifier)) {

    // Add attacked primer
    player.game.addAction("a/protection/attacked", ["attacked"], {
      name: "Protection-primer",
      from: player,
      to: player,
      expiry: Infinity,
      priority: 1,
      tags: ["permanent"]
    });

  };

  player.setGameStat("basic-defense", 2, Math.max);

};
