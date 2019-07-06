// Executes BEFORE introduction

module.exports = function (player) {

  player.misc.promotion_status = 0;

  player.game.addAction("envoy_of_famine/promotion", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
