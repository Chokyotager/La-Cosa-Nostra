var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Modular-visit"});

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  var flavour = game.getGameFlavour();

  if (rs.modular.hasModule(target, "Role Name Investigation Immunity", "trait")) {

    var message = ":mag: You got no result.";

  } else if (target.flavour_role && flavour && flavour.info["investigator-sees-flavour-role"]) {

    // Check roles

    var role = target.flavour_role;
    var message = ":mag: Your target's role is **" + role + "**.";

  } else {

    var roles = target.role.investigation;
    var message = ":mag: Your target could be a " + auxils.pettyOrFormat(roles) + ".";

  };

  game.addMessage(from, message);

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
