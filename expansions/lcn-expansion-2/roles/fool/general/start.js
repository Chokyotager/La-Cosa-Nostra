// Executes BEFORE introduction

module.exports = function (player) {

  player.misc.fool_lynched = false;

  player.game.addAction("fool/lynched", ["lynch"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
