var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

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
    game.addAction("pyromaniac/douse", ["cycle"], {
      name: "Pyromaniac-douse",
      expiry: 1,
      from: pyromaniac.id,
      to: to.id
    });

    // Notifications
    game.addMessage(from, ":exclamation: You have ordered a __Pyromaniac__ to douse your target.");
    game.addMessage(pyromaniac, ":exclamation: The __Pyrofather__ has ordered you to douse his target, **" + to.getDisplayName() + "**.");

  } else {
    // Pyromaniac is not available or dead
    // Pyrofather will douse target himself

    game.addMessage(from, ":exclamation: You have personally doused your target.");

    game.execute("visit", {visitor: actionable.from,
      target: actionable.to,
      priority: actionable.priority,
      reason: "Pyrofather-douse"});

    var doused = game.getPlayerByIdentifier(actionable.to);

    doused.misc.doused = true;

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
