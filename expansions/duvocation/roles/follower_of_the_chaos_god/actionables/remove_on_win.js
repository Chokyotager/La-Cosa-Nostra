var lcn = require("../../../../../source/lcn.js");

var fs = require("fs");
var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var chaos_follower = game.getPlayerByIdentifier(actionable.from);

  if (chaos_follower.misc.kills_to_win < 1) {
    // Has won
    game.kill(chaos_follower, "gone, it seems they accomplished what they came to the Duvocation for", "never seen again, having fulfilled your win condition");

    chaos_follower.misc.role_cleaned = true;
    chaos_follower.setDisplayRole("[Unknown]");

    return true;
  };

};
