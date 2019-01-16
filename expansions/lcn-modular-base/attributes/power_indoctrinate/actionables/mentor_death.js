var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var config = game.config;

  var mentor = game.getPlayerByIdentifier(actionable.from);
  var mentee = game.getPlayerByIdentifier(mentor.misc.cult_member);

  if (!mentee || !mentee.isAlive()) {
    return true;
  };

  game.silentKill(mentee, "found dead, having killed yourself over the death of your mentor", "found dead, having killed yourself over the death of your mentor", 2);

  return true;

};
