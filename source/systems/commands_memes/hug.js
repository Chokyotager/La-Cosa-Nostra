module.exports = function (message, params, config) {

  if (params.length < 1) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "hug <target>` instead!");
    return null;
  };

  message.channel.send(":hugging: **" + message.author.username + "** hugged **" + params.join(" ") + "**! PDA much.");

};
