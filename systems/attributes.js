var fs = require("fs");

var attributes_dir = __dirname + "/../attributes";
var attributes = fs.readdirSync(attributes_dir);

var ret = new Object();

for (var i = 0; i < attributes.length; i++) {

  var usable = new Object();

  usable.attribute = attemptGetting(attributes_dir + "/" + attributes[i] + "/attribute.json");

  usable.start = attemptRequiring(attributes_dir + "/" + attributes[i] + "/general/start.js");
  usable.routines = attemptRequiring(attributes_dir + "/" + attributes[i] + "/general/routines.js");

  ret[attributes[i]] = usable;

};

module.exports = ret;

function attemptRequiring (directory) {
  var available = fs.existsSync(directory);

  if (available) {
    return require(directory);
  } else {
    return undefined;
  };

};

function attemptGetting (directory) {
  var available = fs.existsSync(directory);

  if (available) {
    return JSON.parse(fs.readFileSync(directory));
  } else {
    return undefined;
  };

};
