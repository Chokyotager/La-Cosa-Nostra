// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("godfather/attacked", ["attacked"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.game.addAction("godfather/lock_mafia_chat_on_death", ["killed"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
