var fs = require("fs");

module.exports = function () {


  // Create logger

  var logger = new (require("./systems/game_templates/Logger.js"))(__dirname + "/../log.txt");
  process.logger = logger;

  process.on("unhandledRejection", function (error, promise) {

    logger.log(4, "Unhandled promise rejection.");
    logger.logError(error);

  });

  process.on("uncaughtException", function (error) {

    logger.log(4, "Uncaught fatal exception, terminating to prevent corruption.");
    logger.logError(error);

    process.exit();

  });

  var version = JSON.parse(fs.readFileSync(__dirname + "/../package.json"));

  var lcn = require("./lcn.js");

  var config = lcn.config;

  logger.setLogLevel(config["console-log-level"], config["file-log-level"]);

  var auxils = lcn.auxils;

  if (version.engineStrict) {

    var version_comparison = auxils.compareVersion(process.versions.node, version.engines.node.replace(/[>|=]/g, ""));

    if (version_comparison < 0) {
      var error = new Error("Failed to initialise due to incompatible Node version. You are using version " + process.versions.node + ", please use " + version.engines.node + " instead.");
      throw error;
    };

  };

  return [logger, version, lcn];

};
