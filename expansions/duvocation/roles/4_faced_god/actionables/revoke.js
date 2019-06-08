var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  // Revoke a random unused blessing
  // Get followers
  var followers = game.getAlivePlayers().filter(x => x.role_identifier === "follower_of_3" && rs.modular.hasModule(x, "blessing_restraint") && rs.modular.hasModule(x, "blessing_security") && rs.modular.hasModule(x, "blessing_vigour"));

  if (followers.length < 1) {
    return true;
  };

  // Choice
  var steal_from = auxils.choice(followers);
  var stealable = auxils.shuffle(["blessing_vigour", "blessing_restraint", "blessing_security"]);

  // Decrement one at random
  var attributes = steal_from.attributes;

  steal_loop:
  for (var i = 0; i < stealable.length; i++) {
    for (var j = attributes.length - 1; j >= 0; j--) {

      if (attributes[i].identifier !== identifier) {
        continue;
      };

      if (typeof attributes[j].tags.uses === "number") {
        attributes[j].tags.uses--;
      };

      if (attributes[j].tags.uses < 1 && attributes[j].tags.uses !== "Infinity") {
        // Remove
        attributes.splice(j, 1);
      };

      //game.addMessage(steal_from, ":exclamation: The blessing **" + attributes[j].name + "** was taken from you last night!");
      break steal_loop;

    };

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
