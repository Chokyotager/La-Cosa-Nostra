var lcn = require("../../../source/lcn.js");
var fs = require("fs");

module.exports = function (playing) {

  var roles_override = JSON.parse(fs.readFileSync(__dirname + "/setup.json"));
  playing = lcn.auxils.objectOverride(playing, roles_override);

  return playing;

};
