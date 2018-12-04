// Remove a player emote
// used when the player is killed

var alphabets = require("../alpha_table.js");

module.exports = async function (game, identifier) {

  var role = game.getPlayerByIdentifier(identifier);
  var alphabet = role.alphabet;
  var target_emote = alphabets[alphabet];

  var client = game.client;
  var config = game.config;

  role.clearVotes();

  var period_log = game.getPeriodLog();

  var guild = client.guilds.find(x => x.id === config["server-id"]);
  var trial = guild.channels.get(period_log.trial_vote.channel);

  var messages = period_log.trial_vote.messages;

  for (var i = 0; i < messages.length; i++) {
    var message = await trial.fetchMessage();

    var emote = message.reactions.get(target_emote);

    if (emote !== undefined) {
      await emote.remove();
    };

  };

};
