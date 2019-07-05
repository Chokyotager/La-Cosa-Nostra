var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var context = actionable.context;

  var target = game.getPlayerByIdentifier(actionable.to);
  var attacker = game.getPlayerByIdentifier(actionable.from);

  var message = params.message;

  // Check the text message
  var content = message.content;

  // Should only be in public channels
  if (message.channel.id !== game.getMainChannel().id && message.channel.id !== (game.getWhisperLogChannel() || new Object()).id) {
    return false;
  };

  // Run tests
  var condition = false;

  var words = content.split(" ");
  for (var i = 0; i < words.length; i++) {

    var word = words[i].toLowerCase().split("");

    if (word.length < context.difficulty) {
      continue;
    };

    var hits = new Array();

    for (var j = 0; j < context.letters.length; j++) {

      var letter = context.letters[j];

      if (hits.includes(letter)) {
        continue;
      };

      if (word.includes(letter)) {
        hits.push(letter);
        continue;
      };

    };

    if (hits.length >= context.fulfil) {
      condition = true;
      break;
    };

  };

  if (!condition) {
    return false;
  };

  // Detonate the player
  rs.prototypes.unstoppableAttack.reason = "blown to bits by a __Reactionary__";

  // Detonation is astral
  rs.prototypes.unstoppableAttack(...arguments, true);

  target.setDisplayRole("Hidden");

  game.addAction("reactionary/reveal_role", ["cycle"], {
    name: "Reactionary-reveal",
    expiry: 1,
    from: target,
    to: target
  });

  // Remove defusion message
  game.actions.delete(x => x.identifier === "reactionary/defused_message" && x.from === actionable.from && x.to === actionable.to);

  // Add score to Reactionary
  attacker.misc.reactionary_kills_left--;

  game.getMainChannel().send(":boom: **" + target.getDisplayName() + "** has been blown to bits!");
  target.getPrivateChannel().send(":boom: You have been blown to bits!");

  attacker.getPrivateChannel().send(":exclamation: You have successfully blown your target up!");

  if (attacker.misc.reactionary_kills_left <= 0) {
    // Check win
    game.checkWin();
  };

  return true;

};
