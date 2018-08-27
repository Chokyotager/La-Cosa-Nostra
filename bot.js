var Discord = require("Discord.js");
var client = new Discord.Client();
var fs = require("fs");

var auxils = require("./systems/auxils.js");

var config = auxils.config_handler();
var commands = require("./systems/commands.js");
var game = require("./systems/game.js");

client.on("ready", function () {
  console.log("Bedlam Mafia ready.");

  auxils.readline(client, config, commands);

  client.user.setPresence({
    status: "online",
    game: {name: "La Cosa Nostra v0.1", type: "PLAYING"}
  });

  if (config["automatically-load-saves"]) {
    autoload();
  };

});

client.on("message", function (message) {

  var content = message.content;

  if (content.startsWith(config["command-prefix"])) {
    var edited = content.substring(config["command-prefix"].length, content.length).split(/[ ]/g);

    var command = edited[0].toLowerCase();
    edited.splice(0, 1);

    if (commands.unaffiliated[command] !== undefined) {
      // Run command
      commands.unaffiliated[command](message, edited, config);
      return null;
    };

    if (commands.memes[command] !== undefined) {
      commands.memes[command](message, edited, config);
      return null;
    };

    if (commands.admin[command] !== undefined) {
      // Check permissions
      var member = message.member;

      if (member.roles.some(x => x.name === config["permissions"]["admin"])) {
        commands.admin[command](message, edited, config);
      } else {
        message.channel.send(":x: You do not have permissions to use this command!");
      };

      return null;
    };

    if (commands.game[command] !== undefined) {
      // Check if game is in progress
      if (process.timer !== undefined && process.timer.game.state === "playing") {

        commands.game[command](process.timer.game, message, edited);

      } else {
        message.channel.send(":x: There is no game in progress!");
      };

      return null;

    };

    // Run framework function
    if (commands.role[command] !== undefined) {
      // Check if game is in progress

      if (process.timer !== undefined && process.timer.game.state === "playing") {

        commands.role[command](process.timer.game, message, edited);

      } else {
        message.channel.send(":x: There is no game in progress!");
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
  welcome.send(":wave: Hi <@" + member.id + ">! Welcome to La Cosa Nostra!");

});

// Autoload
function autoload () {
  // Check for game save
  var saved = fs.existsSync(__dirname + "/game_cache/game.save");

  if (!saved) {
    console.log("No game save found.");
    return null;
  };

  // Load the save
  var timer = game.templates.Timer.load(client, config);

  process.timer = timer;

  console.log("Restored save.");

};

client.login(config["bot-token"]);
