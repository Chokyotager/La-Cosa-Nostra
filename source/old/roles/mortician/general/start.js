// Executes BEFORE introduction

module.exports = function (player) {

  player.misc.mortician_protections = 0;
  player.misc.mortician_protection_online = false;

  player.game.addAction("mortician/attacked", ["attacked"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
