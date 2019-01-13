module.exports = function (actionable, game, params) {

  var attacked = game.getPlayerByIdentifier(actionable.from);

  if (!attacked.misc.vagrant_vest_shot) {

    attacked.misc.vagrant_vest_shot = true;
    game.addMessage(attacked, ":exclamation: You were attacked last night! Your bulletproof vest is now broken!");

    return false;
  };

  attacked.setGameStat("basic-defense", 0, "set");

  // Return true regardless
  // Null the attack
  return true;

};
