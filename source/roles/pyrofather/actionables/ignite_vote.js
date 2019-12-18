var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  /* This is trickier
  because of a role assignation problem.*/

  var actions = game.actions;

  // Check if Pyromaniac is available
  // If multiple are available, pick the first one to perform the shooting

  var from = game.getPlayerByIdentifier(actionable.from);
  var to = game.getPlayerByIdentifier(actionable.to);

  var pyromaniac = game.find(x => x.role_identifier === "pyromaniac" && x.isAlive() && !x.getStatus("roleblocked") && !x.getStatus("kidnapped"));

  if (pyromaniac) {
    // Pyromaniac is available

    // Clear out Pyromaniac's actions
    actions.delete(x => x.from === pyromaniac.identifier && (x.identifier === "pyromaniac/douse" || x.identifier === "pyromaniac/ignite"));

    // Add a new action in the Pyromaniac's name
    game.addAction("pyromaniac/ignite", ["cycle"], {
      name: "Pyromaniac-ignition",
      expiry: 1,
      from: pyromaniac.id,
      to: to.id
    });

    // Notifications
    game.addMessage(from, ":exclamation: You have ordered a __Pyromaniac__ to ignite.");
    game.addMessage(pyromaniac, ":exclamation: The __Pyrofather__ has ordered you to ignite.");

  } else {
    // Pyromaniac is not available or dead
    // Pyrofather will ignite

    game.execute("visit", {visitor: actionable.from,
      target: actionable.to,
      priority: actionable.priority,
      reason: "Pyromaniac-ignition"});

    game.addMessage(from, ":exclamation: You have personally ignited.");

    // Get all ignited players
    var doused = game.findAll(x => x.misc.doused === true && x.isAlive());

    for (var i = 0; i < doused.length; i++) {

      rs.prototypes.unstoppableAttack.reason = "annihilated in a fire set by a member of the __Mafia__";
      var outcome = rs.prototypes.unstoppableAttack({to: doused[i].identifier, from: actionable.from, tags:["astral"]}, game, params, true);

      if (!outcome) {
        game.addMessage(from, ":exclamation: " + doused[i].getDisplayName() + " survived the fire!");
      };

    };

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
