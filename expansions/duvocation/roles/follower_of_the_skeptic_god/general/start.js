// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("follower_of_the_skeptic_god/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
