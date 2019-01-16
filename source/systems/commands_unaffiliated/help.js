var fs = require("fs");

var root = __dirname + "/../";

var commands = new Object();

var items = fs.readdirSync(root);

for (var i = 0; i < items.length; i++) {
  if (items[i].startsWith("commands_") && fs.lstatSync(root + items[i]).isDirectory()) {
    var key = items[i].substring(9, Infinity);
    commands[key] = new Array();

    var register = fs.readdirSync(root + items[i]);

    for (var j = 0; j < register.length; j++) {

      if (register[j].endsWith(".js")) {
        commands[key].push(register[j].substring(0, register[j].length - 3));
      };

    };

  };
};

module.exports = function (message, params, config) {

  // Check if host
  var extended = message.member.roles.some(x => x.name === config["permissions"]["admin"]);

  var available = Object.keys(commands);

  var ret = new Array();

  for (var i = 0; i < available.length; i++) {

    if (["readline"].includes(available[i])) {
      continue;
    };

    if (["admin"].includes(available[i]) && !extended) {
      continue;
    };

    var sub = commands[available[i]];

    ret.push("**" + available[i] + "** commands: " + sub.sort().map(x => "`" + x + "`").join(", "));

  };

  message.channel.send("**LCN Commands Index" + (extended ? " [extended]" : "") + "** (prefix `" + config["command-prefix"] + "`)\n\n" + ret.join("\n\n"));

};
