var fs = require("fs");
var lcn = require("../../../source/lcn.js");

module.exports = function (config) {

  // Override configuration liberally
  var override = JSON.parse(fs.readFileSync(__dirname + "/override.json"));

  return lcn.auxils.objectOverride(config, override);

};
