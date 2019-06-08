var fs = require("fs");
var crypto = require("crypto");

var main_dir = __dirname + "/../../../";

var ignore = ["configuration/", ".git"];

if (fs.existsSync(main_dir + ".gitignore")) {

  var gitignore_options = fs.readFileSync(main_dir + ".gitignore", "utf8").split("\n").filter(x => !x.startsWith("#") && x !== "");

  ignore = ignore.concat(gitignore_options);
  
};

var hash_type = "sha256";

module.exports = async function (message, params, config) {

  var hash = crypto.createHash(hash_type);

  var addendum = new String();
  if (params.length > 0) {
    var additional_directory = params.join(" ");
    addendum = additional_directory.replace("\\", "/").substring((additional_directory.startsWith("/") ? 1 : 0), additional_directory.length - (additional_directory.endsWith("/") ? 1 : 0)) + "/";
  };

  var directories = cycle(main_dir + addendum, "").map(x => x.substring(x.indexOf("//") + 1));

  for (var i = 0; i < ignore.length; i++) {
    var regex = new RegExp(escapeRegExp(ignore[i]), "g");
    directories = directories.filter(x => !regex.test(x));
  };

  for (var i = 0; i < directories.length; i++) {
    var file = fs.readFileSync(main_dir + addendum + directories[i]);
    hash.update(addendum + directories[i]);
    hash.update(file);
  };

  var output = hash.digest("hex");

  await message.channel.send(":hash: The code's output `" + hash_type + "` hash (excluding `.gitignore`'d options and `configuration/`) is:\n```fix\n" + hash_type + "-" + output + "```");

};

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

function escapeRegExp (string) {
  return string.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace("*", "(.*?)"); // $& means the whole matched string
};
