var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Investigator-investigation"});

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  var flavour = game.getGameFlavour();

  // Check roles
  if (target.flavour_role && flavour && flavour.info["investigator-sees-flavour-role"]) {

    var role = target.flavour_role;

    if (target.role_identifier === "mafia_follower_of_the_chaos_god") {
      role = "Follower of The Chaos God";
    };

    //lol i know this is a dumb way to do it but it required the least thinking
    if (role.charAt(0) == "F") {
      var extra = " a ";
    } else {
      var extra = " the ";
    };

    var message = ":mag: Your target is" + extra + "**" + role + "**.";

  } else {

    var roles = target.role.investigation;
    var message = ":mag: Your target could be a " + auxils.pettyOrFormat(roles) + ".";

  };

  game.addMessage(from, message);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
