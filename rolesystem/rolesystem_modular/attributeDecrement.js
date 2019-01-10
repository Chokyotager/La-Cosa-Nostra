module.exports = function (actionable, game, params, greedy=false, log=true) {

  var player = game.getPlayerByIdentifier(actionable.from);
  var attributes = player.attributes;

  // Check "a/<attribute>/<actionable>"
  var identifier = actionable.identifier.split("/")[1];

  if (log) {

    // Create a log if it does not exist
    if (!player.modular_log) {
      player.modular_log = new Array();
    };

    player.modular_log.push(identifier);

  };

  // Scan through attributes
  for (var i = attributes.length - 1; i >= 0; i--) {

    if (attributes[i].identifier !== identifier) {
      continue;
    };

    if (typeof attributes[i].tags.uses === "number") {
      attributes[i].tags.uses--;
    };

    if (attributes[i].tags.uses < 1 && attributes[i].tags.uses !== "Infinity") {
      // Remove
      attributes.splice(i, 1);
    };

    if (!greedy) {
      break;
    };

  };

  game.execute("miscellaneous", {target: player.identifier, event: "modular_log_decrement", module: identifier});

};
