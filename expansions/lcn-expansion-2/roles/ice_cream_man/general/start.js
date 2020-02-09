// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("ice_cream_man/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
