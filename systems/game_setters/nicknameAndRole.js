/*
Set the nickname and the roles here
*/

module.exports = async function (client, config, roles) {
  var guild = client.guilds.get(config["server-id"]);
  var alive_role = guild.roles.find(x => x.name === config["permissions"]["alive"]);

  for (var i = 0; i < roles.length; i++) {
    var member = guild.members.get(roles[i].id);

    if (member === undefined) {
      console.log("Exception with role id.");
      continue;
    };

    var name = member.displayName;

    // Regex remove square brackets
    // Don't forget double escapes!
    name = name.replace(new RegExp("^(\[[A-z|0-9]{1,2}\] )*", "g"), "");

    try {
      await member.addRole(alive_role);
      await member.setNickname("[" + roles[i].alphabet + "] " + name);
    } catch (err) {
      console.log("Permissions name error. The owner of the server is playing? Not a big deal. Just remember to nick yourself.");
    };

  };

};
