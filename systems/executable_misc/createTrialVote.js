var texts = require("./text/texts.js");
var format = require("./__formatter.js");
var alphabets = require("../alpha_table.js");

var auxils = require("./../auxils.js");

module.exports = async function (game) {

  var roles = game.players;
  var client = game.client;
  var config = game.config;

  var guild = client.guilds.get(config["server-id"]);
  var vote = guild.channels.find(x => x.name === config["channels"]["voting"]);

  var message = texts.public_vote;

  message = message.replace("{;public_votes}", getVoteList());

  message = await vote.send(format(game, message));

  var chunk = 16;
  var messages = [message];
  var alive = game.getAlivePlayers();

  for (var i = 0; i < alive.length; i += chunk) {
    var current = alive.slice(i, i + chunk);

    if (i === 0) {
      for (var j = 0; j < current.length; j++) {
        var alpha = current[j].alphabet.toLowerCase();

        var reaction = alphabets[alpha];

        await message.react(reaction);

      };
    } else {

      var message = await vote.send("_ _");

      messages.push(message);

      for (var j = 0; j < current.length; j++) {
        var alpha = current[j].alphabet.toLowerCase();

        var reaction = alphabets[alpha];

        await message.react(reaction);

      };

    };

  };

  return messages;

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
          var member = game.getGuildMember(voting_against[j]);
          concat.push(member.displayName);

        };

        var names = auxils.pettyFormat(concat);

        names = voting_against.length > 0 ? ": " + names : "";

        displays.push("<@" + roles[i].id + "> (" + voting_against.length + "/{!votes_required})" + names);
      } else {
        displays.push("[" + roles[i].alphabet + " - dead, **" + roles[i].getDisplayRole() + "**]");
      };
    };

    return displays.join("\n");

  };

};
