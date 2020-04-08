var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var player = game.getPlayerByIdentifier(actionable.from);
  var attributes = player.attributes;

  if (!player.attributes.some(x => x.identifier === "invincibility")) {
    // Remove invincibility
    player.setGameStat("basic-defense", 0, "set");

    // Remove attacked primer
    game.actions.delete(x => x.identifier === "a/invincibility/attacked" && x.from === actionable.from);
    return true;
  };

  attributes.sort((a, b) => a.expiry - b.expiry);

  for (var i = 0; i < attributes.length; i++) {

    if (attributes[i].identifier !== "invincibility") {
      continue;
    };

    if (typeof attributes[i].tags.amount === "number") {
      attributes[i].tags.amount--;
    };

    if (attributes[i].tags.amount < 1) {
      // Remove
      attributes.splice(i, 1);
      break;
    };

  };

};
