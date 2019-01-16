var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var word = actionable.word;

  var target = game.getPlayerByIdentifier(actionable.to);
  var attacker = game.getPlayerByIdentifier(actionable.from);

  var message = params.message;

  // Check the text message
  var content = message.content;

  // Should only be in public channels
  if (message.channel.id !== game.getMainChannel().id && message.channel.id !== (game.getWhisperLogChannel() || new Object()).id) {
    return false;
  };

  // Run checks
  var regex = new RegExp(word, "gi");

  var condition = regex.test(content);

  if (!condition) {
    return false;
  };

  // Detonate the player
  rs.prototypes.unstoppableAttack.reason = "blown to bits by a __Revolutionary__";

  // Detonation is astral
  rs.prototypes.unstoppableAttack(...arguments, true);

  // Remove defusion message
  game.actions.delete(x => x.identifier === "revolutionary/defused_message" && x.from === actionable.from && x.to === actionable.to);

  // Add score to Revolutionary
  attacker.misc.revolutionary_kills_left--;

  game.getMainChannel().send(":boom: **" + target.getDisplayName() + "** has been blown to bits!");
  target.getPrivateChannel().send(":boom: You have been blown to bits!");

  attacker.getPrivateChannel().send(":exclamation: You have successfully blown your target up!");

  if (attacker.misc.revolutionary_kills_left <= 0) {
    // Check win
    game.checkWin();
  };

  return true;

};
