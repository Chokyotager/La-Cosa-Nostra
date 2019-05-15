var readline = require("readline");

module.exports = function (client, config, commands) {

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  createRl();

  function createRl () {
    rl.on("line", async function (msg) {
      var details = msg.split(" ");
      var given = details[0].toLowerCase();;
      var params = given.slice(1);

      var usable = Object.assign(commands["readline"]);

      var executable = usable[given];

      if (executable !== undefined) {
        // Run the command
        var out = await executable(client, config, params);
      } else {
        console.log("Unknown command. Type \"help\" for help.");
      };

    });
  };

};
