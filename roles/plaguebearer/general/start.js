// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("plaguebearer/attacked", ["attacked"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.game.addAction("plaguebearer/infection_spread", ["retrovisit"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent", "infection"],
    priority: 10
  });

  player.game.addAction("plaguebearer/infection_track", ["retrocycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 11
  });

  player.misc.plague_infected = true;

};
