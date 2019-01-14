var lcn = require("../../../../../source/lcn.js");

var fs = require("fs");
var rs = lcn.rolesystem;

var copy_machine_config = JSON.parse(fs.readFileSync(__dirname + "/../config.json"));

module.exports = function (actionable, game, params) {

  var copy_machine = game.getPlayerByIdentifier(actionable.from);

  if (copy_machine.role_identifier !== "modular_copy_machine") {
    return true;
  };

  if (!copy_machine.isAlive()) {
    return true;
  };

  var successes = copy_machine.modular_log.filter(x => x !== "power_power_copy").length;

  if (successes >= 3 && copy_machine_config["leaves-game-upon-winning"]) {
    // Has won
    game.kill(copy_machine, "removed from the game, having fulfilled their win condition", "removed from the game, having fulfilled your win condition");
    return true;
  };

};
