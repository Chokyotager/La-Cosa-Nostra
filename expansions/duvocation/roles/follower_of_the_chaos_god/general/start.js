// Executes BEFORE introduction

module.exports = function (player) {

  player.misc.kills_to_win = 2;

  player.game.addAction("follower_of_the_chaos_god/arbiter_modifier", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.game.addAction("follower_of_the_chaos_god/remove_on_win", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 100
  });

};
