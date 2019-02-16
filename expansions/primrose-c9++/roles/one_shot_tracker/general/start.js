// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("one_shot_tracker/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.misc.tracks_left = 1;

};
