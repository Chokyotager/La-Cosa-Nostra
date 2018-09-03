var fs = require("fs");

var ret = new Array();

var root = __dirname + "/../../roles/";

var roles = fs.readdirSync(root);

for (var i = 0; i < roles.length; i++) {
  var sub = root + roles[i] + "/";

  if (!fs.lstatSync(sub).isDirectory()) {
    continue;
  };

  // Grab the role.json file
  var jx = JSON.parse(fs.readFileSync(sub + "role.json"));
  ret.push(jx);

};

module.exports = async function (message, params, config) {

  var display = new Array();
  for (var i = 0; i < ret.length; i++) {
    display.push(ret[i]["role-name"] + " (*" + cpl(ret[i]["alignment"]) + "-" + cpl(ret[i]["class"]) + "*)")
  };

  message.channel.send("**Registered roles (" + ret.length + ")**\n\n" + display.join("\n"));

};

function cpl (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
