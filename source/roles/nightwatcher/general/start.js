// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("nightwatcher/lock_mafia_chat_on_death", ["killed"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.game.addAction("nightwatcher/promotion", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 12
  });

  player.misc.janitor_cleans_left = 2;

};
