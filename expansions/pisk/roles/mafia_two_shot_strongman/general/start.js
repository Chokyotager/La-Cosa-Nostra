// Executes BEFORE introduction

module.exports = function (player) {

  player.addAttribute("mafia_factionkill");

  player.misc.strongkills_left = 2;

};
