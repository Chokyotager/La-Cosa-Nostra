// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("epi_escort/conversion", ["retrocycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 11
  });

  player.misc.visit_log = new Array();

};
