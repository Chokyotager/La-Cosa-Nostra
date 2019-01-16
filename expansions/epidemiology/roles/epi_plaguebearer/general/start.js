// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("epi_plaguebearer/attacked", ["attacked"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.game.addAction("epi_plaguebearer/infection_spread", ["retrovisit"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent", "infection"],
    priority: 10
  });

  player.game.addAction("epi_plaguebearer/infection_track", ["retrocycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 11
  });

  player.game.addAction("epi_plaguebearer/mislynch", ["lynch"], {
    from: player,
    to: "*",
    expiry: Infinity,
    tags: ["permanent"],
    priority: 10
  });

  player.misc.plague_infected = true;
  player.misc.mislynches_achieved = 0;

};
