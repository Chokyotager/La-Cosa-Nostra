module.exports = async function (game) {

  // Create private channel for praetorium cabinet members
  var client = game.client;
  var config = game.config;

  if (!game.exists(x => x.role.alignment === "praetorium")) {
    // Do not create cabinet channel
    return null;
  };

  game.addAction("g/praetorium/convert", ["cycle"], {
    priority: 0.000001,
    tags: ["system", "permanent"]
  });

  game.addAction("g/praetorium/kill", ["cycle"], {
    priority: 0.00001,
    tags: ["system", "permanent"]
  });

  var channel_name = "cabinet";

  var cabinet = game.findAll(x => x.role.alignment === "praetorium");

  var perms = cabinet.map(function (x) {
    return {target: x.getDiscordUser(), permissions: config["base-perms"]["read"]};
  });

  var cabinet_channel = await game.createPrivateChannel(channel_name, perms);

  for (var i = 0; i < cabinet.length; i++) {
    cabinet[i].addSpecialChannel(cabinet_channel);
  };

  await game.sendPin(cabinet_channel, ("**This is the Praetorium Cabinet chat.**\n\nThis chat is open to the parties only at night."));

  game.setChannel(channel_name, cabinet_channel);

};
