var default_config = require("./default_config.js");
var objectOverride = require("../../source/auxils/objectOverride.js");

var childProcess = require("child_process");
var crypto = require("crypto");
var EventEmitter = require("events");

module.exports = class extends EventEmitter {

  constructor (parent_config, directories=new Object()) {

    super();

    var main_path = require.main.path || require.main.filename.substring(0, require.main.filename.lastIndexOf("/") + 1);

    // Override defaults
    directories["log"] = directories["log"] || main_path + "/log.txt";
    directories["data"] = directories["data"] || main_path + "/data/";

    this.identifier = crypto.randomBytes(16).toString("hex");
    this.directories = directories;
    this.config = parent_config;

    this.stdio_options = ["pipe", "pipe", "inherit", "ipc"];

    this.log = false;

  }

  start () {

    var parent_config = objectOverride(default_config, this.config);
    var directories = this.directories;

    // {log_directory, save_directory, expansions_directory}

    var args = ["--subprocess", JSON.stringify({directories: directories, parent_config: parent_config})];

    var wrapper = this;

    this.child_process = runScript(__dirname + "/../../bot.js", args, function (err) {

      if (err) {
        throw err;
      };

      console.log("LCN child process stopped [PID %s].", wrapper.child_process.pid);

    }, this.stdio_options);

    this.stdin = this.child_process.stdin;
    this.stdout = this.child_process.stdout;

    if (this.stdout) {

      this.stdout.setEncoding("utf8");

      this.stdout.on("data", function (string) {

        if (wrapper.log) {
          console.log(string);
        };

      });

    };

    this.child_process.on("message", function (message) {

      if (message.ready === true) {

        wrapper.emit("ready");

      };

    });

    console.log("Initiated LCN child process [PID %s].", this.child_process.pid);

    return this;

  }

  input (string) {

    if (this.stdin) {
      this.stdin.write(string + "\n");
    };

  }

  destroy () {

    this.child_process.kill();

    return this;

  }

  setLog (log) {

    this.log = log;
    return this;

  }

};

function runScript (scriptPath, arguments, callback, stdio_options) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var child_process = childProcess.fork(scriptPath, arguments, {detached: false, stdio: stdio_options});

    // listen for errors as they may prevent the exit event from firing
    child_process.on("error", function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    child_process.on("exit", function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error("Exit code " + code);
        callback(err);
    });

    return child_process;

};
