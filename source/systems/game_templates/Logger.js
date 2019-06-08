var fs = require("fs");

module.exports = class {

  constructor (file=__dirname + "/log.txt", console_threshold=0, file_threshold=0) {

    this.console_threshold = console_threshold;
    this.file_threshold = file_threshold;

    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, "█▀▀ █▀▀█ █░█   █▀▀█ █▀▀   ░░▀ █▀▀█ █▀▀█ █▀▀█ ░▀░ █░░█ █▀▄▀█\n█▀▀ █░░█ ▄▀▄   █░░█ █▀▀   ░░█ █░░█ █▄▄█ █░░█ ▀█▀ █░░█ █░▀░█\n▀░░ ▀▀▀▀ ▀░▀   ▀▀▀▀ ▀░░   █▄█ ▀▀▀▀ ▀░░▀ ▀▀▀█ ▀▀▀ ░▀▀▀ ▀░░░▀\n\n[Log entry created " + new Date().toUTCString() + "]");
    };

    this.file = file;

  }

  log (log_level, message) {

    if (!message) {
      return null;
    };

    var args = Array.from(arguments);

    if (typeof message === "string") {
      for (var i = 2; i < args.length; i++) {
        message = message.replace("%s", args[i]);
      };
    };

    if (log_level >= this.console_threshold) {
      console.log(message);
    };

    if (log_level >= this.file_threshold) {

      if (typeof message === "string") {
        message = message.replace(/\x1b\[[0-9]+m/g, "");
      };

      var content = fs.readFileSync(this.file, "utf8");

      content = content + "\n" + "[" + new Date().toUTCString() + "; " + log_level + "] " + message;

      fs.writeFileSync(this.file, content);

    };

  }

  logError (error) {

    var message = "[Error handled by catcher]\n1. Message: %s\n2. Stack: %s\n[End of error log]";

    this.log(4, message, error.message, error.stack);

  }

  setLogLevel (console_log_level, file_log_level) {

    this.console_threshold = console_log_level;
    this.file_threshold = file_log_level;

  }

};
