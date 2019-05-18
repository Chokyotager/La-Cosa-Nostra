// Unlinks the ENTIRE cache file

var logger = process.logger;

var fs = require("fs");

module.exports = function (client, config) {

  /* The cache is actually not "deleted",
  but renamed.*/

  var current_time = new Date();

  var data_directory = process.directories["data"];

  if (!fs.existsSync(data_directory)) {
    logger.log(2, "[Routine] Made Data directory because it didn't exist.");
    fs.mkdirSync(data_directory);
  };

  var archive = data_directory + "/archive/";

  if (!fs.existsSync(archive)) {
    logger.log(2, "[Routine] Made Archive directory because it didn't exist.");
    fs.mkdirSync(archive);
  };

  if (fs.existsSync(data_directory + "/game_cache")) {
    fs.renameSync(data_directory + "/game_cache", archive + "/game_cache_" + current_time.getTime());
    logger.log(2, "Archived all caches.");
  };

};
