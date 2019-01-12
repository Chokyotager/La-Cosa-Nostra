// Forced command execution

module.exports = async function (message, params, config) {

  var client = message.client;

  var user = client.users.get(params[0]);
  var member = message.guild.members.get(params[0]);

  if (!member) {
    await message.channel.send(":x: That user has an invalid ID and cannot be sudo'd.");
    return null;
  };

  // Creates a "proto" object

  var clone = Object.assign({}, message);

  Object.defineProperty(clone, "author", {value: user, writable: true});
  Object.defineProperty(clone, "member", {value: member, writable: true});
  Object.defineProperty(clone, "content", {value: params.splice(1, Infinity).join(" "), writable: true});
  Object.defineProperty(clone, "client", {value: client, writable: true});
  Object.defineProperty(clone, "artificial", {value: "true", writable: false});

  client.emit("message", clone);

};
