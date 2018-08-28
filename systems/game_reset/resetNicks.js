module.exports = async function (client, config) {
  var guild = client.guilds.get(config["server-id"]);

  var members = guild.members.array();

  // Remove all nickname prefixes

  for (var i = 0; i < members.length; i++) {
    var name = members[i].displayName;

    name = name.replace(new RegExp("^(\[[A-z|0-9]{1,2}\] )*", "g"), "");

    if (name !== members[i].displayName) {
      await members[i].setNickname(name);
    };
  };

};
