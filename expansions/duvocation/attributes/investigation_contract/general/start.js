// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("a/investigation_contract/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: 3,
    execution: 3
  });

  player.game.addAction("a/investigation_contract/standard_noresult", ["cycle"], {
    name: "Standard-noresult",
    from: player,
    to: player,
    expiry: 3,
    execution: 3
  });

};
