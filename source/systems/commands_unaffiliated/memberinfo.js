var Discord = require("discord.js");

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

  var members = guild.members.array().filter(function (x) {
    return x.displayName.toLowerCase() === name.toLowerCase() || x.user.username === name.toLowerCase() || x.user.id === name;
  });

  if (members.length < 1) {
    message.channel.send(":x: Oi! I can't find a member with that name! Try again using a legitimate username/nickname/id!");
    return null;
  };

  for (var i = 0; i < members.length; i++) {
    var embed = new Discord.RichEmbed();

    var member = members[i];

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
    }

    embed.addField("Joined at", member.joinedAt.toISOString(), true);
    embed.addField("Highest role", member.highestRole.name, true);
    embed.addField("Status", presences[member.user.presence.status], true);
    embed.setFooter("Discord ID " + member.user.id);

    embed.setThumbnail(member.user.avatarURL);

    message.channel.send(embed);

  };

};
