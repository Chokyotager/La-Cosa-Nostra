module.exports = function (actionable, game, params) {

  var attacker = game.getPlayerByIdentifier(params.attacker);
  var attacked = game.getPlayerByIdentifier(actionable.from);

  var strength = params.strength;

  var defense = Math.max(attacked.getRoleStats()["basic-defense"], attacked.getPermanentStats()["basic-defense"]);
  var temp_defense = attacked.getTemporaryStats()["basic-defense"];

  var cond1 = strength <= defense;
  var cond2 = defense >= temp_defense;

  if (cond1 && cond2) {
    game.addMessage(attacked, ":exclamation: You were attacked last night!");
  };

};
