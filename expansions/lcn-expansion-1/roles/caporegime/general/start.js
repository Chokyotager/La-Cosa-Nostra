// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("caporegime/attacked", ["attacked"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
