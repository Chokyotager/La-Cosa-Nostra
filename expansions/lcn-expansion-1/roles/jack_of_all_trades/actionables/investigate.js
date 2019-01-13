var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "JOAT-investigation"});

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

  if (target.isAlive()) {
    game.addMessage(from, ":exclamation: You successfully executed your action!");
    from.misc.joat_actions_left--;
  };

  game.addAction("jack_of_all_trades/remove_on_win", ["cycle"], {
    name: "JOAT-remove-on-win",
    expiry: 1,
    from: actionable.from,
    to: actionable.to
  });

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
