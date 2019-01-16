module.exports = async function (game, message, params) {

  var config = game.config;

  var ratio = config["game"]["fast-forwarding"]["ratio"];

  if (!config["game"]["fast-forwarding"]["allow"] || ratio <= 0 || ratio > 1) {
    await message.channel.send(":x: Fast forwarding is disabled in this game!");
    return null;
  };

  if (game.isDay() && !config["game"]["fast-forwarding"]["day"]) {
    await message.channel.send(":x: Fast forwarding is disabled during the day phase.");
    return null;
  } else if (!game.isDay() && !config["game"]["fast-forwarding"]["night"]) {
    await message.channel.send(":x: Fast forwarding is disabled during the night phase.");
    return null;
  };

  if (ratio <= 0.5) {
    console.warn("The fast forward ratio is ≤ 0.5, be noted of anti-sense parity fast forwards.");
  };

  var player = game.getPlayerById(message.author.id);

  // Check existent
  if (player === null) {
    await message.channel.send(":x: You are not in the game!");
    return null;
  };

  if (!player.status.alive) {
    await message.channel.send(":x: Dead people may not vote to skip ahead with the time!");
    return null;
  };

  // Check private channel
  if (player.channel.id !== message.channel.id) {
    await message.channel.send(":x: You cannot use that command here!");
    return null;
  };

  // Put fast forward vote in the game
  var identifier = player.identifier;
  var fast_forwarded = game.votedFastForward(identifier);

  var percentage = Math.round(ratio * 1000)/10;

  if (params.length < 1) {

    if (!fast_forwarded) {

      game.addFastForwardVote(identifier);
      await message.channel.send(":fast_forward: You have __voted to fast forward__ **" + game.getFormattedDay() + "**.\n\n*[__" + percentage + "%__ of all players have to vote for the game to be fast forwarded.]*");

      game.checkFastForward();

    } else {

      game.removeFastForwardVote(identifier);
      await message.channel.send(":play_pause: You have __revoked__ your vote to fast forward **" + game.getFormattedDay() + "**.\n\n*[__" + percentage + "%__ of all players have to vote for the game to be fast forwarded.]*");

    };

    return null;

  };

  switch (params[0]) {

    case "vote":
      if (fast_forwarded) {
        await message.channel.send(":x: You have already voted to fast forward **" + game.getFormattedDay() + "**!");
        break;
      };

      game.addFastForwardVote(identifier);
      await message.channel.send(":fast_forward: You have __voted to fast forward__ **" + game.getFormattedDay() + "**.\n\n[*__" + percentage + "%__ of all players have to vote for the game to be fast forwarded.*]");

      game.checkFastForward();

      break;

    case "unvote":
      if (!fast_forward) {
        await message.channel.send(":x: You are not voting to fast forward **" + game.getFormattedDay() + "**!");
        break;
      };

      game.removeFastForwardVote(identifier);
      await message.channel.send(":play_pause: You have __revoked__ your vote to fast forward **" + game.getFormattedDay() + "**.\n\n[*__" + percentage + "%__ of all players have to vote for the game to be fast forwarded.*]");
      break;

    default:
      await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "fastforward <vote/unvote>` instead!");
      break;

  };

};

module.exports.ALLOW_PREGAME = false;
module.exports.ALLOW_GAME = true;
module.exports.ALLOW_POSTGAME = false;
