// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("conspirator/promotion", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 18
  });

  var mafia = player.game.findAll(x => x.role.alignment === "mafia" && x.role["see-mafia-chat"]);

  mafia = mafia.map((x, index) => (index + 1) + ". " + x.getDisplayName());

  player.addIntroMessage(":exclamation: The members of the Mafia are: \n```fix\n" + mafia.join("\n") + "\n```");

};
