module.exports = function (player) {

  if (!player.game.actions.exists(x => x.identifier === "a/prosperity_charm/attacked" && x.from === player.identifier)) {

    // Add attacked primer
    player.game.addAction("a/prosperity_charm/attacked", ["attacked"], {
      name: "Charm-primer",
      from: player,
      to: player,
      expiry: 1,
      priority: 1
    });

  };

  if (!player.game.actions.exists(x => x.identifier === "a/prosperity_charm/charm" && x.from === player.identifier)) {

    // Add attacked primer
    player.game.addAction("a/prosperity_charm/charm", ["cycle"], {
      name: "Charm-primer",
      from: player,
      to: player,
      expiry: 1,
      priority: 0.000000000000001
    });

  };

  player.setGameStat("basic-defense", 2, Math.max);

};
