var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Recruit to neighbourhood
  var mentor = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  if (target.isAlive()) {

    game.execute("visit", {visitor: actionable.from,
      target: actionable.to,
      priority: actionable.priority,
      reason: "Modular-visit"});

    mentor.misc.cult_member = target.identifier;
    mentor.misc.cult_all_members.push(target.identifier);
    target.changeRole("modular_cult");

    game.addAction("a/power_indoctrinate/lock_cult_chat_on_death", ["killed"], {
      from: mentor.identifier,
      to: target.identifier,
      expiry: Infinity,
      tags: ["permanent"]
    });

    game.addMessage(target, ":exclamation: You have recruited into the Cult by **" + mentor.getDisplayName() + "**. In order to win, you must now survive to see the Cult reach parity and eliminate all threats to itself.");
    game.addMessage(mentor, ":exclamation: You have recruited your target, **" + target.getDisplayName() + "**, into the Cult.");

  } else {

    game.addMessage(mentor, ":exclamation: You tried to recruit your target but they were already dead by then.");

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
