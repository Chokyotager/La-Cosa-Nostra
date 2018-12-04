var pettyFormat = require("./pettyFormat.js");
var formatDateVerbose = require("./formatDateVerbose.js");
var formatUTCDate = require("./formatUTCDate.js");
var levenshteinDistance = require("./levenshteinDistance.js");

var ping_restrictions = new Array();

module.exports = function (client, config) {

  client.on("message", function (message) {
    if (process.timer) {
      process.timer.game.execute("chat", {message: message});
    };
  });

  client.on("message", function (message) {

    if (message.artificial) {
      return null;
    };

    if (!process.timer || process.timer.game.state !== "playing") {
      return null;
    };

    if (message.id === client.user.id) {
      return null;
    };

    // Ping restrictions

    var ping_config = config["message-checks"]["alive-pings"];

    if (!ping_config["restrict"]) {
      return null;
    };

    var guild = client.guilds.get(config["server-id"]);

    var main_channel = guild.channels.find(x => x.name === config["channels"]["main"]);
    var whisper_channel = guild.channels.find(x => x.name === config["channels"]["whisper-log"]);

    var alive_role = guild.roles.find(x => x.name === config["permissions"]["alive"]);

    if (message.channel.id !== main_channel.id && message.channel.id !== whisper_channel.id) {
      return null;
    };

    if (!message.isMentioned(alive_role)) {
      return null;
    };

    for (var i = 0; i < ping_config["exempt"].length; i++) {

      var role_key = ping_config["exempt"][i];

      var exempt_role = guild.roles.find(x => x.name === config["permissions"][role_key]);

      if (exempt_role && message.member.roles.some(x => x.id === exempt_role.id)) {
        return null;
      };

    };

    var current = message.createdAt;
    var count = 0;

    ping_restrictions.push({author: message.author.id, date: current});

    for (var i = ping_restrictions.length - 1; i >= 0; i--) {

      if (ping_restrictions[i].author !== message.author.id) {
        continue;
      };

      var delta = current.getTime() - ping_restrictions[i].date.getTime();

      if (delta > ping_config["threshold-time"]) {

        ping_restrictions.splice(i, 1);

      } else {

        count++;

      };

    };

    if (count > ping_config["threshold"]) {
      message.channel.send(":x: <@" + message.author.id + ">, please refrain from pinging the Alive role more than __" + ping_config["threshold"] + "__ time" + pettyFormat("s", ping_config["threshold"]) + " in the timespan of **" + formatDateVerbose(ping_config["threshold-time"]) + "**!");
    };

  });

  client.on("messageUpdate", function (old_message, new_message) {

    if (!process.timer || process.timer.game.state !== "playing") {
      return null;
    };

    if (new_message.id === client.user.id) {
      return null;
    };

    var edit_config = config["message-checks"]["edits"];

    if (!edit_config["restrict"]) {
      return null;
    };

    var guild = client.guilds.get(config["server-id"]);

    var main_channel = guild.channels.find(x => x.name === config["channels"]["main"]);
    var whisper_channel = guild.channels.find(x => x.name === config["channels"]["whisper-log"]);

    var alive_role = guild.roles.find(x => x.name === config["permissions"]["alive"]);

    if (new_message.channel.id !== main_channel.id && new_message.channel.id !== whisper_channel.id) {
      return null;
    };

    for (var i = 0; i < edit_config["exempt"].length; i++) {

      var role_key = edit_config["exempt"][i];

      var exempt_role = guild.roles.find(x => x.name === config["permissions"][role_key]);

      if (exempt_role && new_message.member.roles.some(x => x.id === exempt_role.id)) {
        return null;
      };

    };

    if (old_message.content < edit_config["minimum-character-count"]) {
      return null;
    };

    // Check for message differences using Levenshtein distance
    var delta = levenshteinDistance(old_message.content, new_message.content);

    if (delta / edit_config["minimum-character-count"] >= edit_config["edit-ratio"]) {

      var edit_delta = new Date().getTime() - (old_message.editedAt || old_message.createdAt).getTime();

      new_message.channel.send(":x: <@" + new_message.author.id + ">, you edited message " + new_message.id + " [__" + old_message.content.length + "__ character" + pettyFormat("s", old_message.content.length) + " → __" + new_message.content.length + "__ character" + pettyFormat("s", new_message.content.length) + "] by __" + Math.round(delta*100/old_message.content.length) + "%__ in the timespan of **" + formatDateVerbose(edit_delta) + "**. Please do not change the context of messages if they pertain to the game!");

    };

  });

  client.on("messageDelete", function (message) {

    if (!process.timer || process.timer.game.state !== "playing") {
      return null;
    };

    if (message.id === client.user.id) {
      return null;
    };

    // Ping restrictions

    var deletion_config = config["message-checks"]["deletion"];

    if (!deletion_config["restrict"]) {
      return null;
    };

    var guild = client.guilds.get(config["server-id"]);

    var main_channel = guild.channels.find(x => x.name === config["channels"]["main"]);
    var whisper_channel = guild.channels.find(x => x.name === config["channels"]["whisper-log"]);

    var alive_role = guild.roles.find(x => x.name === config["permissions"]["alive"]);

    if (message.channel.id !== main_channel.id && message.channel.id !== whisper_channel.id) {
      return null;
    };

    for (var i = 0; i < deletion_config["exempt"].length; i++) {

      var role_key = deletion_config["exempt"][i];

      var exempt_role = guild.roles.find(x => x.name === config["permissions"][role_key]);

      if (exempt_role && message.member.roles.some(x => x.id === exempt_role.id)) {
        return null;
      };

    };

    var current = message.createdAt;

    var length = message.content.length;

    if (length >= deletion_config["minimum-character-count"]) {

      message.channel.send(":x: <@" + message.author.id + ">, you deleted message " + message.id + " [" + length + " character" + pettyFormat("s", length) + "] posted on **" + formatUTCDate(message.createdAt.getTime()) + "**. Please do not delete messages if they pertain to the game!");

    };

  });

};
