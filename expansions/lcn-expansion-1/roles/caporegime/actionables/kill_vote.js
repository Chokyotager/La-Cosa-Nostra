var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  /* This is trickier
  because of a role assignation problem.*/

  var actions = game.actions;

  // Check if Mafioso is available
  // If multiple are available, pick the first one to perform the shooting

  var from = game.getPlayerByIdentifier(actionable.from);
  var to = game.getPlayerByIdentifier(actionable.to);

  var mafioso = game.find(x => x.role_identifier === "mafioso" && x.isAlive() && !x.getStatus("roleblocked") && !x.getStatus("kidnapped"));

  if (mafioso) {
    // Mafioso is available

    // Clear out Mafioso's actions
    actions.delete(x => x.from === mafioso.identifier && x.identifier === "mafioso/shoot");

    // Add a new action in the Mafioso's name
    game.addAction("mafioso/shoot", ["cycle"], {
      name: "Mafioso-shoot",
      expiry: 1,
      from: mafioso.id,
      to: to.id
    });

    // Notifications
    game.addMessage(from, ":exclamation: You have ordered a __Mafioso__ to attack your target.");
    game.addMessage(mafioso, ":exclamation: The __Caporegime__ has ordered you to attack his target, **" + to.getDisplayName() + "**.");

  } else {
    // Mafioso is not available or dead
    // Caporegime will attack target himself

    game.addMessage(from, ":exclamation: You have personally attacked your own target.");

    rs.prototypes.basicAttack.reason = "shot by a member of the __Mafia__";

    var outcome = rs.prototypes.basicAttack(...arguments);

    if (!outcome) {
      var to = game.getPlayerByIdentifier(actionable.to);

      game.addMessage(from, ":exclamation: Your target could not be attacked last night!");

    };


  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
