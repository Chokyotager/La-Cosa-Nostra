var auxils = require("../auxils.js");
var role_info = require("../roles.js");
var win_conditions = require("../win_conditions.js");

var Discord = require("discord.js");

var ret = new Object();

// Categorise
for (var key in role_info) {

  var role = role_info[key];
  var info = role.role;

  if (!ret[info.alignment]) {
    ret[info.alignment] = new Object();
  };

  if (!ret[info.alignment][info.class]) {
    ret[info.alignment][info.class] = new Array();
  };

  ret[info.alignment][info.class].push(info["role-name"]);

};

module.exports = async function (message, params, config) {

  var roles = Object.keys(role_info);

  if (params.length < 1) {
    var sendable = new String();

    for (var alignment in ret) {

      sendable += "\n\n[" + cpl(alignment) + "]";

      for (var category in ret[alignment]) {

        sendable += "\n" + cpl(category) + ": " + ret[alignment][category].join(", ");

      };

    };

    sendable += "\n\n[" + Object.keys(role_info).length + " roles loaded]";

    sendable = "```ini" + sendable + "```\n:exclamation: To get more information on a particular role, enter `" + config["command-prefix"] + "role [info/desc/card] <role name>`."

    await message.channel.send(sendable);

    return null;
  };

  var action = (params[0] || "").toLowerCase();

  if (!["info", "desc", "card"].includes(action)) {

    // Syntax error
    action = "desc";
    var selected = params.splice(0, Infinity).join(" ");

  } else {
    var selected = params.splice(1, Infinity).join(" ");
  };

  var distances = new Array();
  for (var i = 0; i < roles.length; i++) {

    var distance = auxils.hybridisedStringComparison(selected.toLowerCase(), role_info[roles[i]]["role"]["role-name"].toLowerCase());
    distances.push(distance);

  };

  var best_match_index = distances.indexOf(Math.max(...distances));

  var score = distances[best_match_index];

  if (score < 0.7) {
    await message.channel.send(":x: I cannot find that role!");
    return null;
  };

  var role_identifier = roles[best_match_index];
  var role = role_info[role_identifier];

  if (["info"].includes(action)) {

    var embed = new Discord.RichEmbed();

    embed.setColor("BLUE");
    embed.setTitle(role.role["role-name"]);
    embed.setDescription("*" + cpl(role.role.alignment) + "-" + cpl(role.role.class) + "*");

    // Add role information
    //embed.addBlankField();

    var def_stats = ["None", "Basic", "Powerful", "Immune", "Absolute"];
    var kidnap_stats = ["None", "Basic", "Unstoppable"];
    var cardinal = ["No", "Yes", "Yes (special)", "No (special)"];

    embed.addField("General Priority", role.role.stats["priority"], true);
    embed.addField("Defense", def_stats[role.role.stats["basic-defense"]], true);
    embed.addField("Roleblock Immunity", cardinal[role.role.stats["roleblock-immunity"]], true);
    embed.addField("Detection Immunity", cardinal[role.role.stats["detection-immunity"]], true);
    embed.addField("Control Immunity", cardinal[role.role.stats["control-immunity"]], true);
    embed.addField("Redirection Immunity", cardinal[role.role.stats["redirection-immunity"]], true);
    embed.addField("Kidnap Immunity", kidnap_stats[role.role.stats["kidnap-immunity"]], true);
    embed.addField("Vote Magnitude", role.role.stats["vote-magnitude"], true);

    if (role.info) {
      var info = role.info;

      var cond1 = info.abilities && info.abilities.length > 0;
      var cond2 = info.attributes && info.attributes.length > 0;

      if (cond1 || cond2) {embed.addBlankField();};

      if (cond1) {
        embed.addField("Abilities", info.abilities.map(x => "- " + x).join("\n"));
      };

      if (cond2) {
        embed.addField("Attributes", info.attributes.map(x => "- " + x).join("\n"));
      };

      if (cond1 || cond2) {embed.addBlankField();};

      if (info.thumbnail) {
        embed.setThumbnail(info.thumbnail);
      };

      if (info.credits) {
        embed.setFooter("Role by: " + auxils.pettyFormat(info.credits));
      };

    };

    if (win_conditions[role.role["win-condition"]] && win_conditions[role.role["win-condition"]].DESCRIPTION) {
      embed.addField("Win Condition", win_conditions[role.role["win-condition"]].DESCRIPTION, false);
    };

    await message.channel.send(embed);
    return null;

  } else if (["desc"].includes(action)) {

    var send = ":pencil: Description for **{;role}**:\n```fix\n{;description}```";

    send = send.replace(new RegExp("{;role}", "g"), role.role["role-name"]);
    send = send.replace(new RegExp("{;description}", "g"), role.description);

    await message.channel.send(send);
    return null;

  } else if (["card"].includes(action)) {

    // Return card

    if (!role.role_card) {
      await message.channel.send(":x: That role does not have a role card!");
      return null;
    };

    var attachment = new Discord.Attachment(await role.role_card, "role_card.png");
    await message.channel.send(attachment);
    return null;

  };

};

function cpl (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
