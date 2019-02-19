var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  // Visit the target
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Tracker-track"});

  game.addAction("one_shot_tracker/gather", ["cycle"], {
    name: "Tracker-gather",
    expiry: 1,
    from: actionable.from,
    to: actionable.to,
    priority: 12
  });

  var tracker = game.getPlayerByIdentifier(actionable.from);

  tracker.misc.tracks_left--;

};

module.exports.TAGS = ["roleblockable", "drivable", "visit"];
