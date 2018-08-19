var fs = require("fs");

var texts = fs.readdirSync(__dirname);

var ret = new Object();

for (var i = 0; i < texts.length; i++) {
  if (texts[i].endsWith(".txt")) {
    var key = texts[i].substring(0, texts[i].length - 4);
    ret[key] = fs.readFileSync(__dirname + "/" + texts[i], "utf8");
  };
};

module.exports = ret;
