module.exports = function (message, params, config) {

  if (params.length < 1) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "rekt <target>` instead!");
    return null;
  };

  message.channel.send(":smirk: **" + message.member.displayName + "** says **" + params.join(" ") + "** just got rekt! Ouch.");

};
