// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("quack/promotion", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 14
  });

  player.misc.doc_self_heals = 1;

};
