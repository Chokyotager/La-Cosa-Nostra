module.exports = async function (game, player) {

  // Effect is immediate
  await game.getMainChannel().send(":exclamation: **" + player.getDisplayName() + "** has been removed from the game by a moderator.");
  game.kill(player, "killed by a __moderator__");
  game.checkWin();

};
