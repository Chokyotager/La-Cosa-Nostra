var rs = require("../../../rolesystem/rolesystem.js");
var auxils = require("../../../systems/auxils.js");

module.exports = function (actionable, game, params) {

  var fence = game.getPlayerByIdentifier(actionable.from);

  var alive = game.findAll(x => x.isAlive() && x.identifier !== actionable.from && fence.misc.fence_log[0] !== x.identifier);

  if (alive.length < 1) {
    game.addMessage(fence, ":exclamation: There was nobody you could deliver a gun to, thus your gun was voided.");
    return true;
  };

  var target = auxils.choice(alive);

  game.addMessage(fence, ":exclamation: You did not pick a target! As a result, **" + target.getDisplayName() + "** has been selected and you have delivered a gun to them.");

  // Revert back to original haunt
  game.addAction("odd_night_fence/delivery", ["cycle"], {
    name: "Odd-night-Fence-delivery",
    expiry: 1,
    from: actionable.from,
    to: target.identifier
  });

  return true;

};
