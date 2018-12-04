// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("epi_pestilence/attacked", ["attacked"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.game.addAction("epi_pestilence/mislynch", ["lynch"], {
    from: player,
    to: "*",
    expiry: Infinity,
    tags: ["permanent"],
    priority: 10
  });

  player.misc.mislynches_achieved = 0;

};
