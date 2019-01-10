var texts = require("../executable_misc/text/texts.js");
var format = require("../executable_misc/__formatter.js");
var alphabets = require("../alpha_table.js");

var auxils = require("./../auxils.js");

module.exports = async function (game, message, params) {

  var roles = game.players;
  var client = game.client;
  var config = game.config;

  if (!game.isDay()) {
    await message.channel.send(":x: There is no trial during the night!");
    return null;
  };

  var no_lynch_option = game.config["game"]["lynch"]["no-lynch-option"];

  var guild = client.guilds.get(config["server-id"]);

  var sendable = texts.public_votecount;

  sendable = sendable.replace("{;public_votes}", getVoteList());
  sendable = sendable.replace("{;vote_configurations}", getVoteConfiguration());

  await message.channel.send(format(game, sendable));

  function getVoteList () {

    var displays = new Array();
    for (var i = 0; i < roles.length; i++) {
      if (roles[i].status.alive) {
        // Get display role

        // Get people voting against
        var voting_against = roles[i].votes;
        var concat = new Array();

        if (voting_against.length < 1) {
          continue;
        };

        // Get their display names
        for (var j = 0; j < voting_against.length; j++) {

          // Mapped by IDs
          var player = game.getPlayerByIdentifier(voting_against[j].identifier);
          concat.push(player.getDisplayName());

        };

        var names = auxils.pettyFormat(concat);

        names = voting_against.length > 0 ? ": " + names : "";

        displays.push("**" + roles[i].getDisplayName() + "** (" + roles[i].countVotes() + ")" + names);
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

    if (lynch_config["no-lynch-option"]) {
      ret.push(texts.lynchtext_nolynch);
    } else {
      ret.push(texts.lynchtext_standard);
    };

    if (game.hammerActive()) {
      ret.push(texts.lynchtext_hammer);
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

module.exports.ALLOW_PREGAME = false;
module.exports.ALLOW_GAME = true;
module.exports.ALLOW_POSTGAME = false;
