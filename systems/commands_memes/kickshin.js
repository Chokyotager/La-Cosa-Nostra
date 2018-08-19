module.exports = function (message, params, config) {
  var target = params[0];

  if (target === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "kickshin <target>` instead!");
    return null;
  };

  message.channel.send(":boot: **" + message.author.username + "** just kicked **" + target + "** in the shin! Ouch.");

};
