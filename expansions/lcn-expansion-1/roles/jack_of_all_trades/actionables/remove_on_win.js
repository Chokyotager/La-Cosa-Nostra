var lcn = require("../../../../../source/lcn.js");

var fs = require("fs");
var rs = lcn.rolesystem;

var joat_config = JSON.parse(fs.readFileSync(__dirname + "/../config.json"));

module.exports = function (actionable, game, params) {

  var joat = game.getPlayerByIdentifier(actionable.from);

  if (joat.misc.joat_actions_left < 1 && joat_config["leaves-game-upon-winning"]) {
    // Has won
    game.kill(joat, "removed from the game, having fulfilled their win condition", "removed from the game, having fulfilled your win condition");
    return null;
  };

};
