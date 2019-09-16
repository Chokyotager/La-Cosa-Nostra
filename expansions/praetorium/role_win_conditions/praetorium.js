var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (game) {

  // Non-deviant (cabinet) praetorium only
  var praetorium_members = game.findAll(x => x.role.alignment === "Praetorium");
  var recruited_members = praetorium_members.filter(x => x.role["win-condition"] === "deviant_praetorium" && x.isAlive());

  if (recruited_members < 5) {

    var winners = praetorium_members.concat(recruited_members).filter(x => x.canWin());

    // Revolutionaries win
    game.setWins(winners);
    game.getMainChannel().send(auxils.getAssetAttachment("praetorium-wins.jpg"));
    game.primeWinLog("praetorium", "Potentia. Long live the Praetorium!");
    return true;

  };

  return false

};

module.exports.STOP_GAME = true;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = false;

module.exports.PRIORITY = 1;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = ["town"];
module.exports.SURVIVING = ["praetorium"];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "The praetorium has full control with less than five recruited members alive.";
