var logger = process.logger;

module.exports = async function (client, config) {

  // Run auto setup
  logger.log(2, "Executing auto-setup.");

  var guild = client.guilds.find(x => x.id === config["server-id"]);

  logger.log(2, "Creating roles as per config.");

  // Create individual roles

  var permissions = config.permissions;

  var member = guild.me;
  var member_position = member.highestRole.calculatedPosition + 1;

  for (var key in permissions) {
    var position = null;

    if (key === "admin") {
      position = member_position - 1;
    };

    var role = await createRole(permissions[key], position);
  };

  logger.log(2, "Creating text channels as per config.");

  var channels = config.channels;

  for (var key in channels) {
    await createChannel(channels[key], "text");
  };

  logger.log(2, "Creating category channels as per config.");

  var categories = config.categories;

  for (var key in categories) {
    await createChannel(categories[key], "category");
  };

  return "Auto-setup complete. You may modify the roles and channels as you wish, but please do not change their names.";

  async function createRole (name, position=null) {

    if (guild.roles.some(x => x.name === name)) {

      logger.log(2, "Role %s already exists, not creating.", name);
      return null;

    };

    var role = await guild.createRole({name: name, position: position});
    logger.log(2, "Created role %s (position %s).", name, position);

    return role;

  };

  async function createChannel (name, type="text") {

    if (guild.channels.some(x => x.name === name && x.type === type)) {

      logger.log(2, "Channel %s (%s) already exists, not creating.", name, type);
      return null;

    };

    var channel = await guild.createChannel(name, type);
    logger.log(2, "Created channel %s (%s)", name, type);

    return channel;

  };


};
