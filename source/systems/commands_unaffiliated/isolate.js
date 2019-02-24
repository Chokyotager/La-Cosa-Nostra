var auxils = require("../auxils.js");

module.exports = async function (message, params, config) {

  var channel = message.channel;

  // Isolate

  if (params.length < 1) {

    await message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "isolate [pinpoint/cluster/context] <message ID>` instead!");
    return null;

  };

  var mode = params[0].toLowerCase();

  if (!["pinpoint", "cluster", "context"].includes(mode)) {

    var message_id = mode;
    mode = "pinpoint";

  } else {

    var message_id = params[1];

  };

  if (!/[0-9]{18}/g.test(message_id)) {

    await message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "isolate [pinpoint/cluster/context] <message ID>` instead!");
    return null;

  };

  message.channel.startTyping();

  switch (mode) {

    case "pinpoint":
      var limit = 1;
      break;

    case "cluster":
      var limit = 5;
      break;

    case "context":
      var limit = 20;
      break;

  };

  try {

    var messages = await channel.fetchMessages({
      limit: limit,
      around: message_id
    });

  } catch (err) {
    await message.channel.send(":x: Invalid message ID! Please use `" + config["command-prefix"] + "isolate [pinpoint/cluster/context] <message ID>` to isolate a message!");
    await message.channel.stopTyping();
    return null;
  };

  messages = messages.array();

  if (params[0] === "context") {

    // Filter contagion
    var index = messages.findIndex(x => x.id === message_id);
    var author = messages[index].author.id;

    var context = new Array();

    for (var i = 0; i < messages.length; i++) {

      if (messages[i].author.id !== author) {

        if (i < index) {

          context = new Array();
          continue;

        } else {

          break;

        };

      };

      context.push(messages[i]);

    };

    messages = context;

  };

  messages = messages.map(x => {

    var time = x.editedAt || x.createdAt;
    var content = x.content.replace(/```/gm, "");
    var member = x.member;

    var name = member ? member.displayName : x.author.id;

    var addendum = x.id === message_id ? "(@) " : "";

    if (x.author.id === message.client.user.id && content.includes("ISO for message")) {
      return "[" + auxils.formatUTCDate(time) + "] " + addendum + name + ": [bot ISO]";
    };

    return "[" + auxils.formatUTCDate(time) + "] " + addendum + name + ": " + content;

  });

  if (messages.length < 1) {
    await message.channel.send(":x: Cannot find that message! Isolation only works for the channel the command is posted in.");
    await message.channel.stopTyping();
    return null;
  };

  messages.reverse();

  var sendable = messages.filter(x => x !== null).join("\n\n");

  await message.channel.send("**ISO for message** `" + message_id + "`:```ini\n" + sendable + "```");

  await message.channel.stopTyping();

};
