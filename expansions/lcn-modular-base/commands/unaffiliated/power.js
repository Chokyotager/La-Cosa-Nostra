var attributes = require("../../../../source/systems/attributes.js");

var Discord = require("discord.js");

var powers = new Array();

var keys = Object.keys(attributes);
for (var i = 0; i < keys.length; i++) {
  var attribute = attributes[keys[i]].attribute;

  if (attribute.modular && attribute["modular-details"]["cluster"] === "power") {
    powers.push(attribute);
  };
};

module.exports = function (message, params, config) {

  if (params.length < 1) {
    message.channel.send("**List of available powers:**\n```fix\n" + powers.map(x => x.name).join(", ") + "```");
    return null;
  };

  var check = params.join(" ");

  // Find
  var modular = powers.find(x => x.name.toLowerCase() === check.toLowerCase());

  if (!modular) {
    message.channel.send(":x: I cannot find that module!");
    return null;
  };

  var sendable = "Modular Power: **" + modular.name + "**";

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
