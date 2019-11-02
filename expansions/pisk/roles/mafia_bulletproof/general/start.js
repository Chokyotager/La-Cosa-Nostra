// Executes BEFORE introduction

module.exports = function (player) {

  player.addAttribute("mafia_factionkill");

  player.addAttribute("protection", Infinity, {amount: 1});

};
