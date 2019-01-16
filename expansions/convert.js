var readline = require("readline");
var fs = require("fs");

var global_depth = 1;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Key in the directory relative to %s/ to convert. This process is irreversible!", __dirname);

var changes = [
  {from: /require\(".*?\/auxils\.js"\)/g, to: "lcn.auxils"},
  {from: /require\(".*?\/rolesystem\.js"\)/g, to: "lcn.rolesystem"},
  {from: /require\(".*?\/expansions\.js"\)/g, to: "lcn.expansions"},
  {from: /require\(".*?\/executable\.js"\)/g, to: "lcn.executable"},
  {from: /require\(".*?\/commands\.js"\)/g, to: "lcn.commands"},
  {from: /require\(".*?\/game\.js"\)/g, to: "lcn.game"},
  {from: /require\(".*?\/flavours\.js"\)/g, to: "lcn.flavours"},
  {from: /require\(".*?\/expansions\.js"\)/g, to: "lcn.expansions"},
  {from: /require\(".*?\/win_conditions\.js"\)/g, to: "lcn.win_conditions"},
  {from: /require\(".*?\/attributes\.js"\)/g, to: "lcn.attributes"},
  {from: /require\(".*?\/actionables\.js"\)/g, to: "lcn.actionables"}
];

rl.on("line", async function (msg) {

  var directory = __dirname + "/" + msg;

  if (!fs.existsSync(directory)) {
    console.log("Invalid directory %s", directory);
    process.exit();
  };

  // Start conversion
  console.log("Converting files... please wait...");

  var files = cycle(directory);

  for (var i = 0; i < files.length; i++) {

    var file = files[i];
    var depth = file.substring(directory.length, file.length).split("/").length - 1;

    // Run conversion
    // require()...

    var content = fs.readFileSync(file, "utf8");

    var modified = new String(content);
    var contains_require = false;

    for (var j = 0; j < changes.length; j++) {

      modified = modified.replace(changes[j].from, changes[j].to);

    };

    if (modified !== content) {

      var concat = "../".repeat(depth + global_depth);

      // Add LCN require
      modified = "var lcn = require(\"" + concat + "source/lcn.js\");\n\n" + modified;

      fs.writeFileSync(file, modified);

      console.log("Changed file %s", file);

    };


  };

  console.log("Complete.");
  process.exit();

});

function cycle (directory, accept=".js") {

  if (!fs.existsSync(directory)) {
    return new Array();
  };

  var lists = fs.readdirSync(directory);
  var ret = new Array();

  lists = lists.map(x => directory + "/" + x);

  for (var i = 0; i < lists.length; i++) {

    // Recursively check
    if (fs.lstatSync(lists[i]).isDirectory()) {
      ret = ret.concat(cycle(lists[i]));
    } else if (lists[i].endsWith(accept)) {
      ret.push(lists[i]);
    };

  };

  return ret;

};
