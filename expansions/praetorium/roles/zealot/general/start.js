// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("zealot/inform", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    priority: 99,
    tags: ["permanent"]
  });

};
