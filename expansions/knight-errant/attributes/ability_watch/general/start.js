// Executes BEFORE introduction

module.exports = function (player) {

  if (player.game.actions.find(x => x.from === player.identifier && x.identifier === "a/ability_watch/roleblock_noresult")) {

    return null;

  };

  player.game.addAction("a/ability_watch/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
