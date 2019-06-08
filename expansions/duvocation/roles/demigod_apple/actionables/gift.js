var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var to = game.getPlayerByIdentifier(actionable.to);
  var from = game.getPlayerByIdentifier(actionable.from);

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Apple-gift"});

  if (!to.misc.juice) {

    game.addMessage(to, ":apple: You find a glass of apple juice and drink it. It's the best juice you have ever had!");
    to.misc.juice = "apple";

  } else {

    game.addMessage(from, ":exclamation: Your juice was rejected! It seems they already have a taste for orange juice.");

  };

  if (game.isDay()) {
    from.misc.day_gifts--;
  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
