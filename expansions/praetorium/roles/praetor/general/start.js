module.exports = function (player) {

  var game = player.game;

  var main = game.getMainChannel();

  player.setStatus("lynch-proof", true);

  player.misc.praetor_conversions = new Array();

  game.addIntroMessage(main.id, ":exclamation: **" + player.getDisplayName() + "** is the Praetor.");

};
