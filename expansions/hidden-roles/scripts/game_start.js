module.exports = function (game) {

  var players = game.players;

  for (var i = 0; i < players.length; i++) {

    players[i].setDisplayRole("Hidden");

  };

};
