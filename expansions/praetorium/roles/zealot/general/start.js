// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("zealot/inform", ["postcycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
