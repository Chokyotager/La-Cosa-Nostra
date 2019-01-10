var rs = require("../../../rolesystem/rolesystem.js");
var auxils = require("../../../systems/auxils.js");

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
    var message = ":mag: Your target's role is **" + role + "**.";

  } else {

    var roles = target.role.investigation;
    var message = ":mag: Your target could be a " + auxils.pettyOrFormat(roles) + ".";

  };

  game.addMessage(from, message);



};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
