var texts = require("./text/texts.js");
var format = require("./__formatter.js");
var auxils = require("./../auxils.js");

module.exports = async function (game, ended=false) {

  var roles = game.players;
  var client = game.client;
  var config = game.config;

  var no_lynch_option = game.config["game"]["lynch"]["no-lynch-option"];

  var log = game.getPeriodLog();

  var guild = client.guilds.get(config["server-id"]);
  var channel = guild.channels.get(log.trial_vote.channel);

  var display_message = await channel.fetchMessage(log.trial_vote.messages[0]);

  if (ended) {
    var message = texts.public_vote_ended;
  } else {
    var message = texts.public_vote;
  };

  message = message.replace("{;public_votes}", getVoteList());
  message = message.replace("{;vote_configurations}", getVoteConfiguration());

  await display_message.edit(format(game, message));

  function getVoteList () {

    var displays = new Array();
    for (var i = 0; i < roles.length; i++) {
      if (roles[i].status.alive) {
        // Get display role

        // Get people voting against
        var voting_against = roles[i].votes;
        var concat = new Array();

        // Get their display names
        for (var j = 0; j < voting_against.length; j++) {

          // Mapped by IDs
          var player = game.getPlayerByIdentifier(voting_against[j].identifier);
          concat.push(player.getDisplayName());

        };

        var names = auxils.pettyFormat(concat);

        names = voting_against.length > 0 ? ": " + names : "";

        displays.push("<@" + roles[i].id + "> (" + roles[i].countVotes() + ")" + names);
      } else {
        displays.push("[" + roles[i].alphabet + " - dead, **" + roles[i].getDisplayRole(false) + "**]");
      };
    };

    if (no_lynch_option) {

      var voters = game.getNoLynchVoters();
      var vote_count = game.getNoLynchVoteCount();

      var concat = voters.map(x => game.getPlayerByIdentifier(x).getDisplayName());

      var names = auxils.pettyFormat(concat);

      names = voters.length > 0 ? ": " + names : "";

      displays.push("**No-lynch** (" + vote_count + ")" + names);

    };

    return displays.join("\n");

  };

  function getVoteConfiguration () {

    var ret = new Array();
    var lynch_config = config["game"]["lynch"];

    if (game.getLynchesAvailable() > 1) {
      ret.push(texts.lynchtext_available);
    };

    if (!lynch_config["top-voted-lynch"] || game.hammerActive()) {
      if (lynch_config["no-lynch-option"]) {
        ret.push(texts.lynchtext_nolynch);
      } else {
        ret.push(texts.lynchtext_standard);
      };
    } else {
      ret.push(texts.lynchtext_tvl);
    };

    if (game.hammerActive() && !lynch_config["top-voted-lynch"]) {
      ret.push(texts.lynchtext_hammer);
    };

    if (game.hammerActive() && lynch_config["top-voted-lynch"]) {
      ret.push(texts.lynchtext_hammer_tvl);
    };

    if (lynch_config["top-voted-lynch"]) {
      if (lynch_config["tied-random"]) {
        ret.push(texts.lynchtext_maxrandom);
      } else {
        ret.push(texts.lynchtext_maxnolynch);
      };
    };

    return ret.join("\n");

  };

};
