var fs = require("fs");
var roles = require("../roles.js");

// Find the role from the name

// NOTE: SHOULD INCLUDE FUNCTION PROTOTYPES

module.exports = function (identifier, silent=false) {

  identifier = identifier.toLowerCase();

  // Deprecation reformat
  var role = roles[identifier];

  if (!role) {
    
    if (silent) {
      return null;
    };

    throw new Error("Role \"" + identifier + "\" does not exist!");
  };

  var role_obj = role.role;

  role_obj.description = role.description;
  role_obj.role_card = role.role_card;

  role_obj.routine = role.routine;
  role_obj.start = role.start;

  return role_obj;

};
