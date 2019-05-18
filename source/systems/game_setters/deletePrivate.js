module.exports = async function (client, config) {
  var category = config["categories"]["private"];

  // Bug with discord.js
  var cat_channel = client.channels.find(x => x.name === category && x.type === "category");

  // Check if category configuration is correct
  if (cat_channel === null) {
    var err = "Private category is invalid or non-existent!";
    return new Error(err);
  };

  // Delete children of category channel
  // SN: okay "delete children" sounds so wrong
  // but whatever it's "programming"

  var channels = cat_channel.children.array();

  for (var i = 0; i < channels.length; i++) {

    await channels[i].delete();

  };

};
