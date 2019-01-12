module.exports = async function (message, params, config) {

  var guild = message.client.guilds.get(config["server-id"]);

  var category = guild.channels.find(x => x.name === config["categories"]["private"] && x.type === "category");
  var channels = category.children.filter(x => x.type === "text").array();

  await message.channel.send(":hourglass_flowing_sand: Deleting **" + channels.length + "** private channels.");

  for (var i = 0; i < channels.length; i++) {
    await channels[i].delete();
  };

  await message.channel.send(":ok: Deletion complete.");

};
