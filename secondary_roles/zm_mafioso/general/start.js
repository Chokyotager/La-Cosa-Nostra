// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("zm_mafioso/lock_mafia_chat_on_death", ["killed"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.game.addAction("zm_mafioso/promotion", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 17
  });

};
