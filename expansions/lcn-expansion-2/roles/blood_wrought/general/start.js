// Executes BEFORE introduction

module.exports = function (player) {

  player.misc.blood_wrought_killed = false;

  player.game.addAction("blood_wrought/killed", ["killed"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
