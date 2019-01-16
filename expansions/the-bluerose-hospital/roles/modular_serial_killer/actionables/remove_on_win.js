var lcn = require("../../../../../source/lcn.js");

var fs = require("fs");
var rs = lcn.rolesystem;

var sk_config = JSON.parse(fs.readFileSync(__dirname + "/../config.json"));

module.exports = function (actionable, game, params) {

  var serial_killer = game.getPlayerByIdentifier(actionable.from);

  if (serial_killer.role_identifier !== "modular_serial_killer") {
    return true;
  };

  if (!serial_killer.isAlive()) {
    return true;
  };

  var kills = serial_killer.modular_success_log.filter(x => x === "power_rid_kill").length;

  if (kills >= 2 && sk_config["leaves-game-upon-winning"]) {
    // Has won
    game.kill(serial_killer, "removed from the game, having fulfilled their win condition", "removed from the game, having fulfilled your win condition");
    return true;
  };

};
