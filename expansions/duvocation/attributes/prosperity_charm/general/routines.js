var lcn = require("../../../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  if (!player.game.actions.exists(x => x.identifier === "a/prosperity_charm/charm" && x.from === player.identifier)) {

    player.game.addAction("a/prosperity_charm/charm", ["cycle"], {
      name: "Charm-primer",
      from: player,
      to: player,
      expiry: 1,
      priority: 0.000000000000001
    });

  };

  player.setGameStat("basic-defense", 2, Math.max);

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = true;
