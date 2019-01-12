var fs = require("fs");

module.exports = function (client, config) {

  var directories = [__dirname + "/../../game_cache", __dirname + "/../../game_cache/players"];

  for (var i = 0; i < directories.length; i++) {
    if (!fs.existsSync(directories[i])) {
      fs.mkdirSync(directories[i]);
      console.log("[Routine] created cache directories.");
    };
  };

};
