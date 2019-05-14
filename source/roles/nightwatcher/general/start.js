// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("nightwatcher/promotion", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 12
  });

  player.misc.janitor_cleans_left = 2;

};
