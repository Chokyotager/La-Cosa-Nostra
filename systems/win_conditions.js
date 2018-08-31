var fs = require("fs");

var ret = new Object();

var scripts = fs.readdirSync(__dirname + "/../role_win_conditions/");

for (var i = 0; i < scripts.length; i++) {
  if (!scripts[i].endsWith(".js")) {
    continue;
  };

  var runnable = require(__dirname + "/../role_win_conditions/" + scripts[i]);

  var key = scripts[i].substring(0, scripts[i].length - 3);

  ret[key] = runnable;

};

module.exports = ret;
