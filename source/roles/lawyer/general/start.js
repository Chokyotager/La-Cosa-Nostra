// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("lawyer/promotion", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 13
  });

};
