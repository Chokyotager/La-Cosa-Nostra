var rs = require("../../../rolesystem/rolesystem.js");
var auxils = require("../../../systems/auxils.js");

module.exports = function (actionable, game, params) {

  var escort = game.getPlayerByIdentifier(actionable.from);

  var alive = game.findAll(x => x.isAlive() && x.identifier !== actionable.from && !escort.misc.visit_log.includes(x.identifier));

  var target = auxils.choice(alive);

  game.addMessage(escort, ":exclamation: You did not pick a target! As a result, **" + target.getDisplayName() + "** has been selected and you have roleblocked them!");

  // Revert back to original haunt
  game.addAction("epi_escort/roleblock", ["cycle"], {
    name: "Escort-roleblock",
    expiry: 1,
    from: actionable.from,
    to: target.identifier
  });

  return true;

};
