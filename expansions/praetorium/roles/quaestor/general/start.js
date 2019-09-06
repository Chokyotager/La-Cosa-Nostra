module.exports = function (player) {

  var game = player.game;
  var config = game.config;

  player.addIntroMessage(":butterfly: Throughout the whole game, you may choose to cloak into another available role. Should you die by any means, you will be revealed to be of that role.\n\nUse `" + config["command-prefix"] + "cloak <role name>` to select the role you want to cloak into.\n\nYou may do this as many times as you like, effective immediately.");

};
