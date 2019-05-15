var fs = require("fs");

module.exports = function (client, config) {

  // List all readline commands
  var commands = fs.readdirSync(__dirname).filter(x => x.endsWith(".js")).map(x => x.substring(0, x.length - 3));
  console.log("Available commands: " + commands.join(", "));

};
