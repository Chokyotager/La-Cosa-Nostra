// Unlinks the ENTIRE cache file

var logger = process.logger;

var fs = require("fs");

module.exports = function (client, config) {

  /* The cache is actually not "deleted",
  but renamed.*/

  var current_time = new Date();

  var data = __dirname + "/../../../data";

  if (!fs.existsSync(data)) {
    logger.log(2, "[Routine] Made Data directory because it didn't exist.");
    fs.mkdirSync(data);
  };

  var archive = __dirname + "/../../../data/archive/";

  if (!fs.existsSync(archive)) {
    logger.log(2, "[Routine] Made Archive directory because it didn't exist.");
    fs.mkdirSync(archive);
  };

  if (fs.existsSync(__dirname + "/../../../data/game_cache")) {
    fs.renameSync(__dirname + "/../../../data/game_cache", archive + "/game_cache_" + current_time.getTime());
    logger.log(2, "Archived all caches.");
  };

};
