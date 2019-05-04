// Executes BEFORE introduction

module.exports = function (player) {

  player.misc.reactionary_kills_left = 3;

  player.game.addAction("reactionary/attacked", ["attacked"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
