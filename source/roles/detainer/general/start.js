// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("detainer/promotion", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 13
  });

};
