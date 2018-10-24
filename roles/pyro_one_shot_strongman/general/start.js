// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("pyro_one_shot_strongman/lock_mafia_chat_on_death", ["killed"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.game.addAction("pyro_one_shot_strongman/promotion", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 15
  });

  player.misc.strongman_kills_left = 1;

};
