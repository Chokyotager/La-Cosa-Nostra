module.exports = function (player) {

  player.game.addAction("a/you-die-you-lose/killed", ["killed"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
