var Discord = require("discord.js");
var auxils = require("../auxils.js");

module.exports = function (message, params, config) {

  if (params.length < 1) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "memberinfo <username/nickname/id/\"user\">` instead!");
    return null;
  };

  var name = params.join(" ");

  if (name.toLowerCase() === "user") {
    name = message.author.id;
  };

  var guild = message.client.guilds.get(config["server-id"]);

  var members = guild.members.array().map(function (x) {

    if (x.user.id === name) {

      var score = 2;
      return {member: x, score: score};

    };

    var display_name_score = auxils.hybridisedStringComparison(x.displayName, name);
    var username_score = auxils.hybridisedStringComparison(x.user.username, name);

    return {member: x, score: Math.max(display_name_score, username_score)};

  });

  members.sort(function (a, b) {

    return b.score - a.score;

  });

  members.filter(function (x) {

    return x.score >= 0.7;

  });

  if (members.length < 1) {
    message.channel.send(":x: Oi! I can't find a member with that name! Try again using a legitimate username/nickname/id!");
    return null;
  };

  members = members.filter(x => x.score >= members[0].score - 0.02);

  for (var i = 0; i < members.length; i++) {
    
    var embed = new Discord.RichEmbed();

    var member = members[i].member;

    embed.setTitle(member.user.username + "#" + member.user.discriminator);
    embed.setColor(member.displayHexColor);

    if (member.nickname !== null) {
      embed.addField("Nickname", member.nickname);
    };

    var presences = {
      "offline": "Offline/Invisible",
      "online": "Online",
      "idle": "Idle",
      "dnd": "Do Not Disturb"
    };

    embed.addField("Joined server at", member.joinedAt.toISOString(), true);
    embed.addField("Joined Discord at", member.user.createdAt.toISOString(), true);
    embed.addField("Highest role", member.highestRole.name, true);
    embed.addField("Status", presences[member.user.presence.status], true);
    embed.setFooter("Discord ID " + member.user.id);

    embed.setThumbnail(member.user.avatarURL);

    message.channel.send(embed);

  };

};
