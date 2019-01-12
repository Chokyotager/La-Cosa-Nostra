// Unlinks the ENTIRE cache file

var fs = require("fs");

module.exports = function (client, config) {

  /* The cache is actually not "deleted",
  but renamed.*/

  var current_time = new Date();

  var archive = __dirname + "/../../archive/";

  if (!fs.existsSync(archive)) {
    console.log("[Routine] Made Archive directory because it didn't exist.");
    fs.mkdirSync(archive);
  };

  if (fs.existsSync(__dirname + "/../../game_cache")) {
    fs.renameSync(__dirname + "/../../game_cache", archive + "/game_cache_" + current_time.getTime());
    console.log("Deleted all caches.");
  };

};
