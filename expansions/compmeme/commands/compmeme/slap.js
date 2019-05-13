module.exports = function (message, params, config) {

  if (params.length < 1) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "slap <target>` instead!");
    return null;
  };

  message.channel.send(":raised_hand: **" + message.member.displayName + "** slapped **" + params.join(" ") + "**! Oof.");

};
