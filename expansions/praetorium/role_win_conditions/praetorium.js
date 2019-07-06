var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (game) {



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

module.exports.DESCRIPTION = "The praetorium has full control with less than seven recruited members alive.";
