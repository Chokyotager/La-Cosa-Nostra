// Forced command execution

module.exports = function (message, params, config) {

  var client = message.client;

  var user = client.users.get(params[0]);
  var member = message.guild.members.get(params[0]);

  // Creates a "proto" object

  var clone = Object.assign({}, message);

  Object.defineProperty(clone, "author", {value: user, writable: true});
  Object.defineProperty(clone, "member", {value: member, writable: true});
  Object.defineProperty(clone, "content", {value: params.splice(1, Infinity).join(" "), writable: true});
  Object.defineProperty(clone, "client", {value: client, writable: true});

  client.emit("message", clone);

};
