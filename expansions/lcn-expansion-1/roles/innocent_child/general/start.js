module.exports = function (player) {

  var game = player.game;

  var main = game.getMainChannel();

  game.addIntroMessage(main.id, ":exclamation: **" + player.getDisplayName() + "** has been revealed to be a __Town Innocent Child__!");

};
