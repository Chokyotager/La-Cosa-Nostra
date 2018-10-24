var rs = require("../../../rolesystem/rolesystem.js");
var auxils = require("../../../systems/auxils.js");

module.exports = function (actionable, game, params) {

  var jester = game.getPlayerByIdentifier(actionable.from);

  // Lynched player may be dead, so a check is necessary
  var targets = new Array();

  for (var i = 0; i < jester.misc.jester_lynchers.length; i++) {
    var lyncher = game.getPlayerByIdentifier(jester.misc.jester_lynchers[i].identifier);

    if (lyncher.isAlive()) {
      targets.push(lyncher);
    };
  };

  if (targets.length < 1) {
    game.addMessage(jester, ":exclamation: Nobody who lynched you could be haunted!");
    return null;
  };

  var target = auxils.choice(targets);

  game.addMessage(jester, ":exclamation: You did not pick a target! As a result, **" + target.getDisplayName() + "** has been selected at random to be haunted!");

  // Revert back to original haunt
  game.addAction("jester/haunt", ["cycle"], {
    name: "Jester-haunt",
    expiry: 1,
    from: actionable.from,
    to: target.identifier
  });

  return true;

};
