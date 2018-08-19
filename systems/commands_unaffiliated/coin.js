module.exports = function (message, params, config) {
  var output = Math.round(Math.random() * 100);

  if (output < 49) {
    message.channel.send(":money_with_wings: The coin landed on tails!");
  } else if (output >= 51) {
    message.channel.send(":money_with_wings: The coin landed on heads!");
  } else if (output === 49) {
    message.channel.send(":star: The coin landed vertically!");
  } else {
    var dudes = message.guild.members.array();

    var random_dude = dudes[Math.floor(Math.random() * dudes.length)];

    message.channel.send(":star: The coin landed on " + random_dude.user.username + "'s head!");
  };

}
