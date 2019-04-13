var fs = require("fs");

module.exports = function (prefix, extension=".js", directory=__dirname) {

  if (!fs.existsSync(directory)) {
    return null;
  };

  if (!fs.lstatSync(directory).isDirectory()) {
    return null;
  };

  var folders = fs.readdirSync(directory);
  var ret = new Object();

  // Get parent systems directory
  for (var i = 0; i < folders.length; i++) {
    var entry = directory + "/" + folders[i];
    var folder_name_length = folders[i].length;

    if (fs.lstatSync(entry).isDirectory() && folders[i].startsWith(prefix)) {

      var parent = new Object();

      var files = fs.readdirSync(entry);

      for (var j = 0; j < files.length; j++) {
        if (files[j].endsWith(extension)) {
          // Append to parent object
          var file_name_length = files[j].length;
          parent[files[j].substring(0, file_name_length - extension.length)] = require(entry + "/" + files[j]);
        };

      };

      ret[folders[i].substring(prefix.length, folder_name_length)] = parent;

    };

  };

  return ret;

};
