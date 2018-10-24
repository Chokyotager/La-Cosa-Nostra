// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("pestilence/attacked", ["attacked"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
