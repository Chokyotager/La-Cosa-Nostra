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

module.exports = async function (message, params, config) {

  var commands = require("../commands.js");

  // Check if host
  var extended = message.member.roles.some(x => x.name === config["permissions"]["admin"]);

  var extended_ret = new Array();
  var ret = new Array();

  for (var key in commands) {

    if (["readline", "role"].includes(key)) {
      continue;
    };

    if (["admin", "saves"].includes(key) && !extended) {
      continue;
    };

    var sub = commands[key];

    if (["admin", "saves"].includes(key)) {

      extended_ret.push("**" + key + "** commands: " + Object.keys(sub).map(x => "`" + x + "`").join(", "));

    } else {

      ret.push("**" + key + "** commands: " + Object.keys(sub).map(x => "`" + x + "`").join(", "));

    };

  };

  if (extended) {
    ret = extended_ret.concat(["~~                                                                                                    ~~", ...ret]);
  };

  await message.channel.send("**LCN Commands Index" + (extended ? " [extended]" : "") + "** (prefix `" + config["command-prefix"] + "`)\n\n" + ret.join("\n\n"));

};
