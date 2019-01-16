var fs = require("fs");
var Discord = require("discord.js");

var terms = JSON.parse(fs.readFileSync(__dirname + "/../../terminology.json"));
var keys = Object.keys(terms).sort();

module.exports = async function (message, params, config) {

  if (params.length < 1) {
    var embed = new Discord.RichEmbed();

    embed.setColor("RED");
    embed.setTitle("Available lookup terms");
    embed.setDescription(keys.join(", "));

    await message.channel.send(embed);

    return null;
  };

  var search = params.join(" ");

  var ret = undefined;

  for (var i = 0; i < keys.length; i++) {
    if (keys[i].toLowerCase() === search.toLowerCase()) {
      ret = terms[keys[i]];
      var key = keys[i];
    };
  };

  if (ret === undefined) {
    await message.channel.send(":x: I cannot find that term! Enter `" + config["command-prefix"] + "dictionary` for a list of them.");
    return null;
  };

  // Create embed
  var embed = new Discord.RichEmbed();
  embed.setColor("RED");
  embed.setTitle("Lookup for term: **" + key + "**");

  var definitions = Object.keys(ret);

  for (var i = 0; i < definitions.length; i++) {

    if (i > 0) {
      embed.addBlankField(false);
    };

    embed.addField(capFirstLetter(definitions[i]), ret[definitions[i]], false);
  };

  await message.channel.send(embed);

  function capFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

};
