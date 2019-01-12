// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("mafioso/lock_mafia_chat_on_death", ["killed"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
