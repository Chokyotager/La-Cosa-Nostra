var fs = require("fs");
var roles = require("../roles.js");

// Find the role from the name

// NOTE: SHOULD INCLUDE FUNCTION PROTOTYPES

module.exports = function (identifier) {

  identifier = identifier.toLowerCase();

  // Deprecation reformat
  var role = roles[identifier];

  if (!role) {
    throw new Error("Role \"" + identifier + "\" does not exist!");
  };

  var role_obj = role.role;

  role_obj.description = role.description;
  role_obj.role_card = role.role_card;

  role_obj.routine = role.routine;
  role_obj.start = role.start;

  return role_obj;

};
