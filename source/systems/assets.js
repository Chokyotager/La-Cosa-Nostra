var fs = require("fs");

var ret = new Object();

var expansions = require("./expansions.js");
var auxils = require("./auxils.js");

var assets_dir = __dirname + "/../assets/";

var expansion_assets = new Array();

// Add expansions
for (var i = 0; i < expansions.length; i++) {

  var expansion = expansions[i];
  var directory = expansion.expansion_directory + "/assets/";
  
  expansion.additions.assets.forEach(x => {

    expansion_assets.push({name: x, directory: directory});

  });

};

var assets = fs.readdirSync(assets_dir).map(x => {

  return {name: x, directory: assets_dir};

}).concat(expansion_assets);

for (var i = 0; i < assets.length; i++) {
  // Put buffers into the returnable object
  ret[assets[i].name] = fs.readFileSync(assets[i].directory + assets[i].name);

  // Example of key: game-start.jpg
  // To be referenced in assets config
};

module.exports = ret;
