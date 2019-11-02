// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("serial_killer/pick_expiry", ["cycle"], {
    from: player,
    to: player,
    execution: 1,
    expiry: 2
  });

  player.misc.can_pick = true;

  player.addIntroMessage(":exclamation: Please pick a perk before the day ends.\n\n:exclamation: Enter `" + player.game.config["command-prefix"] + "pick <bulletproof/investigation>` to do so. This action is irreversible and failure to do so before the day ends will result in a perk forfeit.\n\n:one: **Bulletproof** - 1-Shot Bulletproof\n:two: **Investigation** - Investigation Immunity");

};
