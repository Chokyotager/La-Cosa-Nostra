/*
Set the nickname and the roles here
*/

var logger = process.logger;

module.exports = async function (client, config, roles) {
  var guild = client.guilds.get(config["server-id"]);
  var alive_role = guild.roles.find(x => x.name === config["permissions"]["alive"]);
  var pre_role = guild.roles.find(x => x.name === config["permissions"]["pre"]);
  var dead_role = guild.roles.find(x => x.name === config["permissions"]["dead"]);
  var aftermath_role = guild.roles.find(x => x.name === config["permissions"]["aftermath"]);

  for (var i = 0; i < roles.length; i++) {
    var member = guild.members.get(roles[i].id);

    if (member === undefined) {
      continue;
    };

    var name = member.displayName;

    // Regex remove square brackets
    // Don't forget double escapes!
    name = name.replace(new RegExp("^(\[[A-z|0-9]{1,2}\] )*", "g"), "");

    try {

      await removeRole(member, [pre_role, dead_role, aftermath_role]);

      await member.addRole(alive_role);
      await member.setNickname("[" + roles[i].alphabet + "] " + name);
    } catch (err) {
      logger.log(3, "Permissions name error. The owner of the server is playing? Not a big deal. Just remember to nick yourself.");
    };

  };

};

async function removeRole (member, roles) {
  for (var i = 0; i < roles.length; i++) {

    if (!roles[i]) {
      continue;
    };

    if (member.roles.has(roles[i].id)) {
      await member.removeRole(roles[i]);
    };
  };
};
