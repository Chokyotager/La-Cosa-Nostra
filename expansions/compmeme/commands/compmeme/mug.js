module.exports = function (message, params, config) {

  if (params.length < 1) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "mug <target>` instead!");
    return null;
  };

  message.channel.send(":tea: **" + message.member.displayName + "** thinks **" + params.join(" ") + "** is a mug! oOF.");

};
