// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("zm_delayed_prosecutor/increase_vote", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
