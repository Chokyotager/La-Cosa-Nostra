var lcn = require("../../../../../source/lcn.js");
var attributes = lcn.attributes;

var Discord = require("discord.js");

var blessings = new Array();

var keys = Object.keys(attributes);
for (var i = 0; i < keys.length; i++) {
  var attribute = attributes[keys[i]].attribute;

  if (attribute.modular && attribute["modular-details"]["cluster"] === "blessing") {
    blessings.push(attribute);
  };
};

module.exports = function (game, message, params) {

  var config = game.config;

  if (params.length < 1) {
    message.channel.send("**List of available blessings:**\n```fix\n" + blessings.map(x => x.name).join(", ") + "```");
    return null;
  };

  var check = params.join(" ");

  // Find
  var modular = blessings.find(x => x.name.toLowerCase() === check.toLowerCase());

  if (!modular) {
    message.channel.send(":x: I cannot find that module!");
    return null;
  };

  var sendable = "Modular blessing: **" + modular.name + "**";

  var concat = new Array();
  var field = modular["modular-details"]["display-field"];
  for (var i = 0; i < field.length; i++) {

    var description = field[i].description;

    if (field[i].name.toLowerCase() === "command") {
      description = config["command-prefix"] + field[i].description;
    };

    concat.push(field[i].name + ": " + description);
  };

  sendable += "\n```fix\n" + concat.join("\n") + "```";

  message.channel.send(sendable);

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = false;
module.exports.DISALLOW_NIGHT = false;
