module.exports = function (actionable, game) {

  var player = game.getPlayerByIdentifier(actionable.from);
  var attributes = player.attributes;

  // Check "a/<attribute>/<actionable>"
  var identifier = actionable.identifier.split("/")[1];

  // Create a log if it does not exist
  if (!player.modular_success_log) {
    player.modular_success_log = new Array();
  };

  player.modular_success_log.push(identifier);

  game.execute("miscellaneous", {target: player.identifier, event: "modular_log_success", module: identifier});

};
