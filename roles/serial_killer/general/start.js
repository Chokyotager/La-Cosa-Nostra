// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("serial_killer/attacked", ["attacked"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
