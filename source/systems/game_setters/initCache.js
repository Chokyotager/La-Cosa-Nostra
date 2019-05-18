var logger = process.logger;

var fs = require("fs");

module.exports = function (client, config) {

  var data_directory = process.directories["data"];

  var directories = [data_directory, data_directory + "/game_cache", data_directory + "/game_cache/players"];

  for (var i = 0; i < directories.length; i++) {
    if (!fs.existsSync(directories[i])) {
      fs.mkdirSync(directories[i]);
      logger.log(2, "[Routine] created cache directories.");
    };
  };

};
