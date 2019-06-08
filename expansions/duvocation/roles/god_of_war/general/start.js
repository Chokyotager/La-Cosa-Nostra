// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("god_of_war/arbiter_modifier", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.misc.executions = 1;

};
