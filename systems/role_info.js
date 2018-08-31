var fs = require("fs");

var ret = new Object();

// Get information

var root = __dirname + "/../roles/";
var roles = fs.readdirSync(root);

for (var i = 0; i < roles.length; i++) {

  var directory = root + roles[i];

  if (!fs.lstatSync(directory).isDirectory()) {
    continue;
  };

  // Read information file
  var info = attemptRead(directory + "/info.json", true);
  var description = attemptRead(directory + "/description.txt");
  var role = attemptRead(directory + "/role.json", true);

  if (!role) {
    var err = new Error(roles[i] + "'s role.json does not exist!");
    throw err;
  };

  var name = role["role-name"];

  ret[name] = {
    role: role,
    description: description,
    info: info
  };

  if (fs.existsSync(directory + "/role_card.png")) {
    ret[name].role_card = new Promise(function(resolve, reject) {
      fs.readFile(directory + "/role_card.png", (err, data) => {

        if (err) {reject(data);};

        resolve(Buffer.from(data));

      });
    });
  };

};

module.exports = ret;

function attemptRead (directory, parse=false) {
  var exists = fs.existsSync(directory);

  if (exists) {
    var ret = fs.readFileSync(directory, "utf8");

    if (parse) {
      return JSON.parse(ret);
    } else {
      return ret;
    };

  } else {
    return null;
  };

};
