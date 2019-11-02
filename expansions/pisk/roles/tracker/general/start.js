// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("tracker/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
