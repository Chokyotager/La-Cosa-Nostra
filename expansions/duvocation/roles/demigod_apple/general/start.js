// Executes BEFORE introduction

module.exports = function (player) {

  player.misc.juice = "apple";
  player.misc.day_gifts = 0;

  player.game.addAction("demigod_apple/arbiter_modifier", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
