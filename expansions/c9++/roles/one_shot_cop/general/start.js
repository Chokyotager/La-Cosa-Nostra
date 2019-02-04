// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("one_shot_cop/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.misc.investigations_left = 1;

};
