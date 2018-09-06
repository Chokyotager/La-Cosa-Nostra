module.exports = async function (message, params, config) {

  var member = message.member;

  if (params.length < 1) {
    await message.channel.send(":x: Wrong syntax! Try using `" + config["command-prefix"] + "notify <on/off>` instead!");
    return null;
  };

  var role = message.guild.roles.find(x => x.name === config["permissions"]["notify"]);
  var has_role = member.roles.some(x => x.id === role.id);

  switch (params[0].toLowerCase()) {

    case "on":
      if (has_role) {
        message.channel.send(":x: You already have the notification role!");
        return null;
      };

      await member.addRole(role);
      await message.channel.send(":exclamation: Successfully added the notification role. Use `" + config["command-prefix"] + "notify off` to remove it.");
      break;

    case "off":
       if (!has_role) {
         message.channel.send(":x: You do not have the notification role!");
         return null;
       };

       await member.removeRole(role);
       await message.channel.send(":exclamation: Successfully removed the notification role. Use `" + config["command-prefix"] + "notify on` to add it again.");
       break;

    default:
      await message.channel.send(":x: Wrong syntax! Try using `" + config["command-prefix"] + "notify <on/off>` instead!");
      return null;

  };

};
