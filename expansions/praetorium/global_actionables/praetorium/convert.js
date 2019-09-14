var lcn = require("../../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  var converts = game.findAll(x => x.misc.praetorium_converted);

  for (var i = 0; i < converts.length; i++) {
    converts[i].alignment = "praetorium";
    converts[i].role["win-condition"] = "deviant_praetorium";
  };

};
