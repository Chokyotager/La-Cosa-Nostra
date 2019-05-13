var Discord = require("discord.js");
var client = new Discord.Client();
var fs = require("fs");

var version = JSON.parse(fs.readFileSync(__dirname + "/package.json"));

var logger = new (require("./source/systems/game_templates/Logger.js"))(__dirname + "/log.txt");
process.logger = logger;

var lcn = require("./source/lcn.js");

var config = lcn.config;

logger.setLogLevel(config["console-log-level"], config["file-log-level"]);

var auxils = lcn.auxils;
var commands = lcn.commands;
var game = lcn.game;

client.options.disableEveryone = true;

var load_time = process.uptime() * 1000;

client.on("ready", function () {
  logger.log(2, "Foxflower La Cosa Nostra [%s] ready.", version.version);

  var login_time = process.uptime() * 1000;

  ready();

  process.setStatus(client);

  var save_status = "NONE ATTEMPTED";

  if (config["automatically-load-saves"]) {
    save_status = autoload();
  };

  var total_load_time = process.uptime() * 1000;
  var stats = [lcn.expansions.length, lcn.expansions.map(x => x.expansion.name).join(", "), Object.keys(lcn.roles).length, Object.keys(lcn.attributes).length, Object.keys(lcn.flavours).length, Object.keys(lcn.win_conditions).length, Object.keys(lcn.commands.role).length, load_time, login_time - load_time, total_load_time - login_time, save_status, total_load_time];
  logger.log(2, "\n--- Statistics ---\n[Modules]\nLoaded %s expansion(s) [%s];\nLoaded %s role(s);\nLoaded %s attribute(s);\nLoaded %s flavour(s);\nLoaded %s unique win condition(s);\nLoaded %s command handle(s)\n\n[Startup]\nLoad: %sms;\nLogin: %sms;\nSave: %sms [%s];\nTotal: %sms\n-------------------\nEnter \"autosetup\" for auto-setup.\nEnter \"help\" for help.\n", ...stats);

});

client.on("message", function (message) {

  var content = message.content;

  if (content.startsWith(config["command-prefix"])) {

    if (message.channel.type === "dm") {
      message.channel.send(":x: I do not handle commands in DM. Please use a guild channel instead.");
      return null;
    };

    var edited = content.substring(config["command-prefix"].length, content.length).split(/[ ]/g);

    var command = edited[0].toLowerCase();
    edited.splice(0, 1);

    if (config["disabled-commands"].includes(command)) {
      message.channel.send(":x: That command has been disabled in the configuration!");
      return null;
    };

    for (var key in commands) {

      if (["readline", "admin", "game", "role"].includes(key)) {
        continue;
      };

      if (commands[key][command] !== undefined) {
        commands[key][command](message, edited, config);
        return null;
      };

    };

    if (commands.admin[command] !== undefined) {
      // Check permissions
      var member = message.member;

      if (member.roles.some(x => x.name === config["permissions"]["admin"])) {
        commands.admin[command](message, edited, config);
      } else {
        message.channel.send(":x: You do not have sufficient permissions to use this command!");
      };

      return null;
    };

    if (commands.game[command] !== undefined) {
      // Check if game is in progress
      if (process.timer !== undefined) {

        var cond1 = process.timer.game.state === "pre-game" && commands.game[command].ALLOW_PREGAME === false;
        var cond2 = process.timer.game.state === "playing" && commands.game[command].ALLOW_GAME === false;
        var cond3 = process.timer.game.state === "ended" && commands.game[command].ALLOW_POSTGAME === false;

        if (!cond1 && !cond2 && !cond3) {
          commands.game[command](process.timer.game, message, edited);
        } else {

          if (cond1) {
            message.channel.send(":x: That command cannot be used in the pre-game!");
          } else if (cond2) {
            message.channel.send(":x: That command cannot be used when the game is running!");
          } else if (cond3) {
            message.channel.send(":x: That command cannot be used in the post-game!");
          };

        };

      } else {
        message.channel.send(":x: There is no game in progress!");
      };

    };

    // Run framework function
    if (commands.role[command] !== undefined) {
      // Check if game is in progress

      if (process.timer !== undefined && process.timer.game.state === "playing") {

        commands.role[command](process.timer.game, message, edited);

      } else {
        //message.channel.send(":x: There is no game in progress!");
      };

      return null;

    };

  };

});

client.on("guildMemberAdd", function (member) {

  var guild = client.guilds.get(config["server-id"]);
  var welcome = guild.channels.find(x => x.name === config["channels"]["welcome-channel"]);

  if (welcome === undefined) {
    return null;
  };

  // Send rule message
  if (config["messages"]["welcome-message"]) {

    var sendable = config["messages"]["welcome-message"];

    sendable = sendable.replace(new RegExp("{;member}", "g"), "<@" + member.id + ">");
    welcome.send(sendable);

  };

  if (config["messages"]["welcome-dm-message"]) {
    member.send(config["messages"]["welcome-dm-message"]);
  };

});

client.on("disconnect", function (close_event) {

  if (process.timer) {

    process.timer.save();

  };

  logger.log(3, "Close event: ", close_event.reason);

  if (config["auto-reconnect"]) {

    logger.log(3, "Automatic restart script initialised.");
    // Attempt reconnection
    client.login(config["bot-token"]);

  };

});

// Ready
function ready () {

  if (!process.ready) {

    auxils.readline(client, config, commands);
    auxils.eventhandler(client, config);

    process.ready = true;

  };

};

// Autoload
function autoload () {
  // Check for game save
  var saved = fs.existsSync(__dirname + "/data/game_cache/game.save");

  if (!saved) {
    logger.log(2, "\x1b[1m%s\x1b[0m", "No game save found.");
    return "\x1b[1m\x1b[34mNO SAVE FOUND\x1b[0m";
  };

  // Load the save
  var timer = game.templates.Timer.load(client, config);

  if (!timer) {
    logger.log(2, "\x1b[1m%s\x1b[0m", "Did not restore save.");
    return "\x1b[1m\x1b[31mFAILED\x1b[0m";
  };

  process.timer = timer;

  logger.log(2, "\x1b[1m%s\x1b[0m", "Restored save.");

  return "\x1b[1m\x1b[32mSUCCESSFUL\x1b[0m";

};

client.login(config["bot-token"]);

process.setStatus = function (client) {

  client.user.setPresence({
    status: "online",
    game: {name: "Foxflower LCN " + version.version, type: "PLAYING"}
  });

};
