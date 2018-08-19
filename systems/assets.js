var fs = require("fs");

var ret = new Object();

var assets_dir = __dirname + "/../assets/";

var assets = fs.readdirSync(assets_dir);

for (var i = 0; i < assets.length; i++) {
  // Put buffers into the returnable object
  ret[assets[i]] = fs.readFileSync(assets_dir + assets[i]);

  // Example of key: game-start.jpg
  // To be referenced in assets config
};

module.exports = ret;
