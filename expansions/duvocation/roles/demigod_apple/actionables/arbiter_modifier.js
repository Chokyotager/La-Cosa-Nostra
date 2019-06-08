var lcn = require("../../../../../source/lcn.js");
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);

  if (game.arbiter_god_alive) {
    return null;
  };

  from.misc.day_gifts = 1;

  game.addMessage(from, ":exclamation: Because the days are no longer organized without the Arbiter God, you can now gift __" + from.misc.day_gifts + "__ juice" + auxils.vocab("s", from.misc.day_gifts) + " during the day.");

  return true;

};
