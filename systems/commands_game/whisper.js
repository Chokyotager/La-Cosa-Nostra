module.exports = async function (game, message, params) {

  var client = game.client;
  var config = game.config;

  if (!config["game"]["whispers"]["allow"]) {
    message.channel.send(":x: Whispers are not allowed in this game!");
    return null;
  };

  var day = game.period % 2 === 0;

  if (day && !config["game"]["whispers"]["day"]) {
    message.channel.send(":x: You may not whisper during the day.");
  };

  if (!day && !config["game"]["whispers"]["night"]) {
    message.channel.send(":x: You may not whisper at night.");
  };

  var target = params[0];
  var context = Array.from(params).splice(1, Infinity).join(" ");

  var player = game.getPlayerMatch(target);

  console.log(player);

  if (player.score > 3) {
    // Disallow
    message.channel.send(":x: I cannot find that player! Try again using `" + config["command-prefix"] + "whisper <alphabet/name> <message>`!");
    return null;
  };

  player = player.player;

  var sender = game.getPlayerById(message.author.id);

  if (sender === null) {
    message.channel.send(":x: You are not in the game!");
    return null;
  };

  if (sender.channel.id !== message.channel.id) {
    message.channel.send(":x: You cannot use that command here!");
    return null;
  };

  if (player.isSame(sender)) {
    message.channel.send(":x: You cannot whisper to yourself. That would be weird.");
    return null;
  };

  if (!player.status.alive && config["game"]["whispers"]["allow-dead"]) {
    message.channel.send(":x: You are dead! How can you send whispers?");
    return null;
  };

  if (params.length < 2) {
    message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "whisper <alphabet/name> <message>` instead!");
    return null;
  };

  var guild = client.guilds.get(config["server-id"]);

  var target_channel = guild.channels.get(player.channel.id);
  var sender_channel = guild.channels.get(sender.channel.id);
  var whisper_log = guild.channels.find(x => x.name === config["channels"]["whisper-log"]);

  var d_player = game.getGuildMember(player.id) || {displayName: "undef'd-player", user: {username: "undef'd-player"}};
  var d_sender = game.getGuildMember(sender.id) || {displayName: "undef'd-player", user: {username: "undef'd-player"}};

  sender_channel.send(":speech_left: **You** → **" + d_player.displayName + "**: " + context);
  target_channel.send(":speech_balloon: **" + d_sender.displayName + "** → **You**: " + context);

  if (whisper_log !== undefined && config["game"]["whispers"]["broadcast"]) {
    whisper_log.send(":speech_left: **" + d_sender.displayName + "** is whispering to **" + d_player.displayName + "**.");
  };

  message.delete();

};
