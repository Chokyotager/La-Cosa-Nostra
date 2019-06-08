var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var to = game.getPlayerByIdentifier(actionable.to);
  var from = game.getPlayerByIdentifier(actionable.from);

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Orange-gift"});

  if (!to.misc.juice) {

    game.addMessage(to, ":tropical_drink: You find a glass of orange juice and drink it. It's the best juice you have ever had!");
    to.misc.juice = "orange";

  } else {

    game.addMessage(from, ":exclamation: Your juice was rejected! It seems they already have a taste for apple juice.");

  };

  if (game.isDay()) {
    from.misc.day_gifts--;
  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
