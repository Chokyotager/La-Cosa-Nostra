module.exports = function (message, params, config) {

  if (params.length < 1) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "highfive <target>` instead!");
    return null;
  };

  message.channel.send(":open_hands: **" + message.member.displayName + "** gives **" + params.join(" ") + "** a high five!");

};
