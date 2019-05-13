module.exports = function (message, params, config) {

  if (params.length < 1) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "kickshin <target>` instead!");
    return null;
  };

  message.channel.send(":boot: **" + message.author.username + "** just kicked **" + params.join(" ") + "** in the shin! Ouch.");

};
