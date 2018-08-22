var fs = require("fs");

var ret = new Object();

var directory = __dirname + "/../auxils";

var files = fs.readdirSync(directory);

var extension = ".js";

for (var i = 0; i < files.length; i++) {
  if (files[i].endsWith(extension)) {
    var key = files[i].substring(0, files[i].length - extension.length);
    ret[key] = require(directory + "/" + files[i]);
  };
};

module.exports = ret;
