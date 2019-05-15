var lcn = require("../../../../../source/lcn.js");

// Executes BEFORE introduction

var auxils = lcn.auxils;

module.exports = function (player, attribute) {

  player.addAttribute("protection", Infinity, {amount: attribute.tags.uses});

  attribute.expiry = 0;

};

module.exports.DO_NOT_RUN_ON_GAME_START = false;
module.exports.DO_NOT_RUN_ON_ADDITION = false;
