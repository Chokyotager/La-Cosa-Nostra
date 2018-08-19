module.exports = function (message, params, config) {
  var target = params[0];

  if (target === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "slap <target>` instead!");
    return null;
  };

  message.channel.send(":raised_hand: **" + message.author.username + "** slapped **" + slapped + "**! Oof.");

};
