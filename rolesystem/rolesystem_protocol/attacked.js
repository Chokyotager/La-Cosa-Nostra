module.exports = function (actionable, game, params) {

  var attacker = game.getPlayerByIdentifier(params.attacker);
  var attacked = game.getPlayerByIdentifier(actionable.from);

  var strength = params.strength;

  var defense = Math.max(attacked.getRoleStats()["basic-defense"], attacked.getPermanentStats()["basic-defense"]);
  var temp_defense = attacked.getTemporaryStats()["basic-defense"];

  var cond1 = strength <= defense;
  var cond2 = defense >= temp_defense;

  if (cond1 && cond2) {
    var day = game.isDay();

    if (!day) {
      game.addMessage(attacked, ":exclamation: You were " + module.exports.NIGHT_MESSAGE + "!");
    } else {

      if (module.exports.INSTANT_FOR_DAY) {
        attacked.getPrivateChannel().send(":exclamation: You were " + module.exports.DAY_MESSAGE + "!");
      } else {
        game.addMessage(attacked, ":exclamation: You were " + module.exports.DAY_MESSAGE + "!");
      };

    };
  };

};

module.exports.DAY_MESSAGE = "attacked";
module.exports.NIGHT_MESSAGE = "attacked last night";

module.exports.INSTANT_FOR_DAY = true;
