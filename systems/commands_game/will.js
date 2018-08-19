module.exports = function (game, message, params) {

  var config = game.config;

  var player = game.getPlayerById(message.author.id);

  // Check existent
  if (player === null) {
    message.channel.send(":x: You are not in the game!");
    return null;
  };

  if (!player.status.alive) {
    message.channel.send(":x: Dead people cannot write wills!");
    return null;
  };

  // Check private channel
  if (player.channel.id !== message.channel.id) {
    message.channel.send(":x: You cannot use that command here!");
    return null;
  };

  if (params.length < 1) {
    message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "will <view/write> [will]` instead!");
    return null;
  };

  var action = params[0];
  var will = params.splice(1, Infinity).join(" ");

  switch (action) {
    case "view":
      var will = player.getTrueWill();

      if (will !== undefined) {
        var send = ":pen_fountain: Your current last will:\n```fix\n" + will + "```\n\nUse `" + config["command-prefix"] + "will write <will>` to change it!";
      } else {
        var send = ":pen_fountain: You do not have a last will yet!\n\nUse `" + config["command-prefix"] + "will write <will>` to change it!";
      };

      message.channel.send(send);
      break;

    case "write":

      if (/`/g.test(will)) {
        message.channel.send(":x: Please do not use code formatting in last wills!");
        return null;
      };

      will = will.trim().replace(/^\s+|\s+$/g, "");;

      if (will.length > 800) {
        message.channel.send(":x: Last wills cannot exceed 800 characters!");
        return null;
      };

      if (will.length === 0) {
        // Unset

        player.setWill(undefined);

        var send = ":pen_ballpoint: You have removed your last will."
        message.channel.send(send);

      } else {

        player.setWill(will);

        var send = ":pen_ballpoint: You have changed your last will.\n\nUse `" + config["command-prefix"] + "will view` to view it.";
        message.channel.send(send);

      };
      break;

    default:
      message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "will <view/write> [will]` instead!");
      break;

  };

};
