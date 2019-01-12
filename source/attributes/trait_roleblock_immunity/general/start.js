// Executes BEFORE introduction

var auxils = require("../../../systems/auxils.js");

module.exports = function (player) {

  player.setPermanentStat("roleblock-immunity", 1);

};
