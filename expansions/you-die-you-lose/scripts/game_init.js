module.exports = function (game) {

  var players = game.players;

  for (var i = 0; i < players.length; i++) {

    players[i].addAttribute("you-die-you-lose");

  };

};
