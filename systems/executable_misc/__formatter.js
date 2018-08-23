// format messages

/*

LEGEND:

# - channel
@ - ping role
! - special
+ - vocab {+[term]|[key]} followed by special
; - do not use

*/

var auxils = require("../auxils.js");

module.exports = function (game, message) {
  // Ping roles

  var config = game.config;
  var client = game.client;

  var guild = client.guilds.get(config["server-id"]);

  var parameters = getParameters(game);

  var roles = Object.keys(config["permissions"]);

  for (var i = 0; i < roles.length; i++) {

    // Check for pings
    var search = "{@" + roles[i] + "}";

    if (message.includes(search)) {
      var role = guild.roles.find("name", config["permissions"][roles[i]]);

      if (role !== null) {
        // Set the ping
        message = message.replace(new RegExp(search, "g"), "<@&" + role.id + ">");
      };

    };

  };

  var channels = Object.keys(config["channels"]);

  for (var i = 0; i < channels.length; i++) {
    var search = "{#" + channels[i] + "}";
    var channel = guild.channels.find("name", config["channels"][channels[i]]);

    if (channel !== null) {
      message = message.replace(new RegExp(search, "g"), "<#" + channel.id + ">");
    };

  };

  // Specials

  var misc = Object.keys(parameters);

  for (var i = 0; i < misc.length; i++) {
    message = message.replace(new RegExp("{!" + misc[i] + "}", "g"), parameters[misc[i]]);

  };

  // Vocabulary
  var regex = new RegExp("{\\+([A-z]+)\\|(.*?)}", "g");
  var matches = message.match(regex) || new Array();

  for (var i = 0; i < matches.length; i++) {
    regex = new RegExp("{\\+([A-z]+)\\|(.*?)}", "g");

    var catches = regex.exec(matches[i]);

    var grammar = catches[1];
    var param = parameters[catches[2]];

    message = message.replace(matches[i], auxils.vocab(grammar, param));
  };

  var quotes = Object.keys(config["messages"]);

  for (var i = 0; i < quotes.length; i++) {
    message = message.replace(new RegExp("{#" + quotes[i] + "}", "g"), config["messages"][quotes[i]]);
  };

  return message;

};

function getParameters (game) {

  var config = game.config;
  var ret = {
    "alive": game.getAlive(),
    "day_hours": config.time.day,
    "night_hours": config.time.night,
    "utc_formatted": formatDate(game.current_time),
    "next_utc_formatted": formatDate(game.next_action),
    "game_chronos": game.getFormattedDay().toUpperCase(),
    "game_chronos_next": game.getFormattedDay(1),
    "game_chronos_last": game.getFormattedDay(-1),
    "cycle": game.period % 2 === 0 ? "daytime" : "nighttime",
    "trials_left": game.getPeriodLog().trials,
    "votes_required": game.getVotesRequired(),
    "veto_time": config.game["veto-time"]
  };

  return ret;

  function formatDate (date) {

    date = new Date(date);

    var day = date.getUTCDate();
    var month = date.toLocaleString("en-gb", { month: "long" });
    var year = date.getUTCFullYear();

    var hours = date.getUTCHours() < 10 ? "0" + date.getUTCHours() : date.getUTCHours();
    var minutes = date.getUTCMinutes() < 10 ? "0" + date.getUTCMinutes() : date.getUTCMinutes();

    var formatted = day + " " + month + " " + year + " UTC " + hours + ":" + minutes;

    return formatted;
  };

};
