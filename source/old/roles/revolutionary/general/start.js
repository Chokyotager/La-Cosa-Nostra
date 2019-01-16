// Executes BEFORE introduction

module.exports = function (player) {

  player.misc.revolutionary_kills_left = 3;

  player.game.addAction("revolutionary/attacked", ["attacked"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
