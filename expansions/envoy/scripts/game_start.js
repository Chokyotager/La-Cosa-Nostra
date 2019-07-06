module.exports = async function (game) {

  // Create private channel for envoys
  var client = game.client;
  var config = game.config;

  if (!game.exists(x => x.role.alignment === "envoy")) {
    // Do not create envoy channel
    return null;
  };

  var channel_name = "envoys";

  var envoys = game.findAll(x => x.role.alignment === "envoy");

  var perms = envoys.map(function (x) {
    return {target: x.getDiscordUser(), permissions: config["base-perms"]["read"]};
  });

  var envoy_channel = await game.createPrivateChannel(channel_name, perms);

  for (var i = 0; i < envoys.length; i++) {
    envoys[i].addSpecialChannel(envoy_channel);
  };

  await game.sendPin(envoy_channel, ("**This is the Envoy chat.**\n\nThis chat is open to the parties only at night."));

  game.setChannel(channel_name, envoy_channel);

};
