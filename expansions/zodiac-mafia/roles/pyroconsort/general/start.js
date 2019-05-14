// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("pyroconsort/promotion", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 16
  });

};
