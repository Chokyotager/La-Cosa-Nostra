var readline = require("readline");

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports = function (client, config, commands) {

  createRl();

  function createRl () {
    rl.on("line", async function (msg) {
      var details = msg.split(" ");
      var given = details[0];
      var params = given.slice(1);

      var usable = Object.assign(commands["readline"], commands["admin"]);

      var executable = usable[given];

      if (executable !== undefined) {
        // Run the command
        var out = await executable(client, config, params);
        console.log(out);
      } else {
        console.log("Unknown command. Type \"help\" for help.");
      };

    });
  };

};
