var fs = require("fs");
var config_handler = require("./systems/config_handler.js");

var primitive_config = config_handler("configuration.json", false);

module.exports = function () {

  process.directories = {
    "log": __dirname + "/../log.txt",
    "data": __dirname + "/../data/",
    "expansions": [__dirname + "/../expansions/"]
  };

  // Subprocess handler (for NPM Foxorchid LCN)
  if (primitive_config["allow-config-override-subprocess"]) {

    // Check subprocesses
    var args = Array.from(process.argv).splice(2);
    if (args.length >= 2) {

      var is_subprocess = args[0].toLowerCase() === "--subprocess";

      if (is_subprocess) {

        process.is_subprocess = true;

        try {

          var data = JSON.parse(args.splice(1).join(" "));

          process.parent_data = data;

          process.directories["log"] = data.directories["log"] || process.directories["log"];
          process.directories["data"] = data.directories["data"] || process.directories["data"];

          if (!data.directories["expansions"]) {

            process.directories["expansions"] = process.directories["expansions"];

          } else if (Array.isArray(data.directories["expansions"])) {

            var has_default = data.directories["expansions"].some(x => x === "default");

            if (has_default) {
              process.directories["expansions"] = process.directories["expansions"].concat(data.directories["expansions"].filter(x => x === "default"));
            } else {
              process.directories["expansions"] = data.directories["expansions"];
            };

          } else {

            process.directories["expansions"] = process.directories["expansions"].concat([data.directories["expansions"]]);

          };

        } catch (err) {

          // Crash the program at this level
          throw err;

        };

      };

    };

  };

  // Create logger
  var log_directory = process.directories.log;

  var logger = new (require("./systems/game_templates/Logger.js"))(log_directory);
  process.logger = logger;

  if (process.parent_data) {

    logger.log(2, "Running LCN as a subprocess [PID: %s].", process.pid);

  };

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

  process.version_info = version;

  var lcn = require("./lcn.js");

  var config = lcn.config;

  logger.setLogLevel(config["console-log-level"], config["file-log-level"]);

  var auxils = lcn.auxils;

  if (version.engineStrict) {

    var version_comparison = auxils.compareVersion(process.versions.node, version.engines.node);

    if (!version_comparison) {
      var error = new Error("Failed to initialise due to incompatible Node version. You are using version " + process.versions.node + ", please use " + version.engines.node + " instead.");
      throw error;
    };

  };

  var expansions = lcn.expansions;

  for (var i = expansions.length - 1; i >= 0; i--) {

    var init_script = expansions[i].scripts.init;

    if (!init_script) {
      continue;
    };

    init_script(lcn, version);

  };

  return [logger, version, lcn];

};
