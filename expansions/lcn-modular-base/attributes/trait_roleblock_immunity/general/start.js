var lcn = require("../../../../../source/lcn.js");

// Executes BEFORE introduction

var auxils = lcn.auxils;

module.exports = function (player) {

  player.setPermanentStat("roleblock-immunity", 1);

};
