var reader = require("../systems/__reader.js");
var auxils = require("../systems/auxils.js");

var rolesystem = reader("rolesystem_", ".js", __dirname);

var expansions = require("../systems/expansions.js");

for (i = 0; i < expansions.length; i++) {

  var expansion = expansions[i];

  var directory = expansion.expansion_directory + "/rolesystem/";

  var expansion_rolesystem = reader("rolesystem_", ".js", directory);

  if (!expansion_rolesystem) {
    continue;
  };

  // Concatenate
  rolesystem = auxils.objectOverride(rolesystem, expansion_rolesystem);

};

module.exports = rolesystem;
