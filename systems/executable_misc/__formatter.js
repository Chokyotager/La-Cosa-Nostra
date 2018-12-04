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
      var role = guild.roles.find(x => x.name === config["permissions"][roles[i]]);

      if (role !== null) {
        // Set the ping
        message = message.replace(new RegExp(search, "g"), "<@&" + role.id + ">");
      };

    };

  };

  var channels = Object.keys(config["channels"]);

  for (var i = 0; i < channels.length; i++) {
    var search = "{#" + channels[i] + "}";
    var channel = guild.channels.find(x => x.name === config["channels"][channels[i]]);

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

  var log = game.getPeriodLog();

  var config = game.config;
  var ret = {
    "alive": game.getAlive(),
    "day_hours": config.time.day,
    "night_hours": config.time.night,
    "utc_formatted": auxils.formatUTCDate(game.current_time),
    "next_utc_formatted": auxils.formatUTCDate(game.next_action),
    "now_utc": auxils.formatUTCDate(new Date()),
    "game_chronos": game.getFormattedDay().toUpperCase(),
    "game_chronos_next": game.getFormattedDay(1),
    "game_chronos_last": game.getFormattedDay(-1),
    "cycle": game.isDay() ? "daytime" : "nighttime",
    "trials_left": game.getTrialsAvailable(),
    "votes_required": game.getVotesRequired(),
    "nolynch_votes_required": game.getNoLynchVotesRequired(),
    "veto_time": config.game["veto-time"]
  };

  return ret;

};
