// Forced sudo execution

module.exports = async function (message, params, config) {

  var client = message.client;

  var user = client.users.get(params[0]);
  var member = message.guild.members.get(params[0]);

  if (!user) {
    user = {
      id: params[0],
      username: "undef'd player",
      bot: false
    };
  };

  if (!member) {
    member = {
      id: params[0]
    };
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
