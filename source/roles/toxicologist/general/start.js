// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("toxicologist/promotion", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 13
  });

  player.misc.toxicologist_poisons_left = 2;

};
