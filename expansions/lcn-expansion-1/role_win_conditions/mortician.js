var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

var town_win_condition = require("../../../source/role_win_conditions/town.js");
var mafia_win_condition = require("../../../source/role_win_conditions/mafia.js");

module.exports = function (game) {

  var players = game.players;

  var alive = game.findAll(x => x.isAlive());
  var mafia = game.findAll(x => x.role.alignment === "mafia" && x.isAlive());

  var mafia_win_check = !game.checkRoles(mafia_win_condition.ELIMINATED) && game.checkRoles(mafia_win_condition.SURVIVING);

  var mortician = game.findAll(x => x.isAlive() && x.role_identifier === "mortician");

  if (mafia.length >= (alive.length / 2) && mafia_win_check) {
    // Mafia's win condition
    // Steal the win from them

    var winners = mortician.filter(x => x.canWin());

    game.setWins(winners);
    game.getMainChannel().send(auxils.getAssetAttachment("mortician-wins.png"));
    game.primeWinLog("mortician", "The Mortician has stolen the win from the Mafia.");

    module.exports.STOP_GAME = true;
    return true;

  };

  // Check Town win
  var town_win_check = !game.checkRoles(town_win_condition.ELIMINATED) && game.checkRoles(town_win_condition.SURVIVING);

  if (town_win_check) {

    var winners = mortician.filter(x => x.canWin());

    game.setWins(winners);
    return true;
  };

  return false;

};

module.exports.STOP_GAME = false;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = false;

module.exports.PRIORITY = 1;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = [];
module.exports.SURVIVING = ["mortician"];

module.exports.PREVENT_CHECK_ON_WIN = ["mafia"];

module.exports.DESCRIPTION = "Survive to the end of the game. If the Mafia wins, you will steal the kill from them. If the Town wins, you win with them if you are still alive. Any other Neutral solo wins will lead to your loss.";
