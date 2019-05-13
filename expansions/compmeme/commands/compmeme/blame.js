module.exports = function (message, params, config) {

  if (params.length < 1) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "blame <target>` instead!");
    return null;
  };

  message.channel.send(":no_good: **" + message.author.username + "** blames **" + params.join(" ") + "**! Manipulative!");

};
