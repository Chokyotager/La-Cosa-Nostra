// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("a/modular_mafia_promotion/promotion_pid_kill", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 1000
  });

  player.game.addAction("a/modular_mafia_promotion/promotion_power_inspect", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 1000
  });

};
