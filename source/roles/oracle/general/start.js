// Executes BEFORE introduction

module.exports = function (player) {

  player.misc.oracle_last_target = null;

  player.game.addAction("oracle/reveal", ["killed"], {
    name: "Oracle-reveal",
    expiry: Infinity,
    from: player,
    to: player,
    tags: ["permanent"]
  });

};
