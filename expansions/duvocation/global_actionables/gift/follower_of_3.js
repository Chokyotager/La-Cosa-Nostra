var lcn = require("../../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  var followers = game.findAll(x => x.isAlive() && x.role_identifier === "follower_of_3");

  if (followers.length < 1) {
    return true;
  };

  // Assignations
  // [security, restraint, vigour]

  var available_blessings = ["blessing_security", "blessing_restraint", "blessing_vigour"];
  var blessings = [auxils.choice(available_blessings), auxils.choice(available_blessings)];

  for (var i = 0; i < blessings.length; i++) {

    var blessing = blessings[i];
    var follower = auxils.choice(followers);

    if (follower.hasAttribute(blessing)) {
      follower.attributes.find(x => x.identifier === blessing).tags.uses++;
    } else {
      follower.addAttribute(blessing, Infinity, {uses: 1});
    };

    game.addMessage(follower, ":exclamation: In the aftermath of the day, you were able to spread the word of the 3-faced god and receive a blessing.");

  };

  return true;

};
