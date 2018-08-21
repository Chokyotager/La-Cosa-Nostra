var fs = require("fs");

// Find the role from the name

// NOTE: SHOULD INCLUDE FUNCTION PROTOTYPES

module.exports = function (name) {

  name = name.toLowerCase();

  var directory = __dirname + "/../../roles";

  var roles = fs.readdirSync(directory);

  if (!roles.includes(name)) {
    var err = "The role " + name + " does not exist!";
    return new Error(err);
  };

  // Passed test - proceed to outline object
  var role_obj = JSON.parse(fs.readFileSync(directory + "/" + name + "/role.json"));
  var description = fs.readFileSync(directory + "/" + name + "/description.txt", "utf8");

  role_obj.description = description;
  role_obj.role_card = attemptReadStream(directory + "/" + name + "/role_card.png");

  role_obj.routine = attemptRequiring(directory + "/" + name + "/general/routines.js");
  role_obj.start = attemptRequiring(directory + "/" + name + "/general/start.js");

  // Returns a 2-tuple of role obj and description
  return role_obj;

};

function attemptReadStream (directory) {
  var available = fs.existsSync(directory);

  if (available) {

    return fs.createReadStream(directory);

  } else {
    return undefined;
  };

};

function attemptRequiring (directory) {
  var available = fs.existsSync(directory);

  if (available) {
    return require(directory);
  } else {
    return undefined;
  };

};
