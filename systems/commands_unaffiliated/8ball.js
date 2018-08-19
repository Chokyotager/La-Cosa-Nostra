module.exports = function (message, params, config) {

  var responses = [
    "It is certain.",
    "It is decidedly so.",
    "Yes - definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Signs point to yes.",
    "Yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again."
  ];

  // I don't even care about the question lol
  if (params.length < 1) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "8ball <question>` instead!");
    return null;
  };

  message.channel.send(":8ball: " + responses[Math.floor(Math.random() * responses.length)]);

  // Get random index
};
